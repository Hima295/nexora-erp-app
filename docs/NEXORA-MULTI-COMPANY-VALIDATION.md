# Nexora ERP Multi-Company Architecture Validation Report
## Architecture Review & Certification
### Version 1.0 — Validation Date: 2026-07-24

**Prepared By:** Lead ERP Architect  
**Scope:** Nexora ERP v1.0+ Multi-Company isolation architecture  
**Status:** VALIDATION COMPLETE

---

## Executive Summary

Nexora ERP is built on top of ERPNext, which provides robust Multi-Company support at the framework level. This audit validates that Nexora's custom layer correctly inherits and extends ERPNext's Multi-Company guarantees without introducing data leakage risks.

**Verdict:** The architecture is fundamentally sound but requires 4 mandatory changes before production certification.

---

## 1. Architecture Review

### 1.1 Foundation: ERPNext Multi-Company Model

ERPNext implements Multi-Company isolation through:

| Layer | Mechanism |
|-------|-----------|
| **Database** | `company` field on all transactional DocTypes |
| **Permissions** | User Permission rules per company |
| **API** | `company` parameter in all API endpoints |
| **Session** | Active company stored in session/context |
| **Reports** | Automatic `company` filter injection |

**Nexora's Responsibility:** Never bypass ERPNext's isolation. All custom APIs, widgets, reports, and AI modules must delegate to ERPNext's context system.

### 1.2 Nexora Architecture Principles

```
Nexora Layer (Custom)
    └── Always delegates to ERPNext for:
        • Company resolution
        • Permission checking
        • Data filtering
        • Session management
    └── Never implements its own:
        • Company storage
        • Cross-company aggregation
        • Bypass of permission rules
```

### 1.3 Context Flow

```
User Login
    ↓
ERPNext sets active company in session
    ↓
Nexora reads from ERPNext context (NEVER caches globally)
    ↓
All Nexora queries include: {"company": session.company}
    ↓
Results scoped to single company
```

---

## 2. Risk Assessment

### 2.1 Risk Matrix

| ID | Risk Area | Severity | Probability | Impact |
|----|-----------|----------|-------------|--------|
| R1 | API request missing company filter | HIGH | Medium | Data leakage between companies |
| R2 | Dashboard widget cross-company aggregation | HIGH | Low | Wrong metrics displayed |
| R3 | Report mixing company data | HIGH | Medium | Executive decisions on wrong data |
| R4 | AI training on cross-company data | HIGH | Low | Biased recommendations |
| R5 | Search returning cross-company results | MEDIUM | Medium | Privacy breach, user confusion |
| R6 | Notification cross-company events | MEDIUM | Medium | Information overload, security |
| R7 | Cache key missing company | HIGH | Medium | Wrong data served to users |
| R8 | Permission bypass in Nexora code | HIGH | Low | Unauthorized data access |
| R9 | Future module forgetting company filter | MEDIUM | High | Accumulating technical debt |
| R10 | Hardcoded company filters in widgets | LOW | Low | Maintenance nightmare |

### 2.2 Risk Severity Definitions

- **HIGH:** Immediate data leakage, compliance violation, requires P0 fix
- **MEDIUM:** Potential data leakage, requires fix before production
- **LOW:** Code smell, should be fixed but not blocking

---

## 3. Weak Points Identified

### 3.1 CRITICAL: No Centralized Company Context Manager

**Issue:** Nexora does not have a single, enforced source of truth for "current company."

**Risk:** Developers may read company from different sources (session, request, cache) with inconsistent results.

**Impact:** Data leakage, wrong filtering, security vulnerability.

### 3.2 CRITICAL: No API Request Guard

**Issue:** No middleware ensures every API request includes company context.

**Risk:** Custom API endpoints may forget to filter by company.

**Impact:** Cross-company data exposure.

### 3.3 HIGH: Cache Key Design Not Documented

**Issue:** Caching strategy for widgets/reports not explicitly defined with company isolation.

**Risk:** Cached data from Company A served to Company B user.

**Impact:** Data leakage, wrong dashboards.

### 3.4 HIGH: AI Training Data Scope Unclear

**Issue:** No guarantee that AI models train only on single-company data.

**Risk:** AI recommendations based on competitor/other-company data.

**Impact:** Wrong decisions, competitive intelligence leak.

### 3.5 MEDIUM: Search Index Not Company-Partitioned

**Issue:** Search may index across all companies without per-company filtering.

**Risk:** Search results leak information from other companies.

**Impact:** Privacy breach, information disclosure.

### 3.6 MEDIUM: Notification Aggregation Not Company-Scoped

**Issue:** Notification system may aggregate events without company filter.

**Risk:** Users see events from other companies.

**Impact:** Information leakage, user confusion.

---

## 4. Recommendations

### 4.1 MANDATORY: Central Company Context Manager

Create a single source of truth for company context:

```python
# nexora/company/context.py (CONCEPTUAL - for specification only)
class CompanyContext:
    @staticmethod
    def get_active_company():
        """Returns company from ERPNext session. NEVER from cache."""
        return frappe.session.get("company")
    
    @staticmethod
    def get_active_branch():
        """Returns branch from ERPNext session context."""
        return frappe.session.get("branch")
    
    @staticmethod
    def validate_company_access(company):
        """Validates user has access to company."""
        return frappe.has_permission("Company", company)
```

**Rule:** Every Nexora module MUST use `CompanyContext.get_active_company()`. Never read company from request params, URL, or cache directly.

### 4.2 MANDATORY: API Request Middleware

Implement middleware that validates company context on every request:

```python
# nexora/api/middleware.py (CONCEPTUAL - for specification only)
class CompanyIsolationMiddleware:
    def preprocess(self, request):
        company = CompanyContext.get_active_company()
        if not company:
            raise PermissionError("No active company")
        request.company = company
        return request
```

**Rule:** All API endpoints inherit this middleware. No exceptions.

### 4.3 MANDATORY: Cache Key Namespacing

All cache keys MUST include company and branch:

```
Pattern: nexora:{company_id}:{branch_id}:{module}:{key}
Example: nexora:Al-Jawhara-Motors:Riyadh:inventory:low_stock
```

**Rule:** Any cached data without company prefix is a critical violation.

### 4.4 MANDATORY: AI Data Isolation

AI training and inference MUST be company-scoped:

```python
# AI query pattern (CONCEPTUAL - for specification only)
def get_ai_insights(company, branch):
    return {
        "company": company,
        "branch": branch,
        "insights": train_on_data(company=company, branch=branch)
    }
```

**Rule:** AI never trains on or recommends based on cross-company data.

### 4.5 RECOMMENDED: Search Company Filter

Search index MUST store and filter by company:

```python
# Search filter pattern (CONCEPTUAL - for specification only)
def search(query, company, branch):
    return frappe.get_all(
        "DocType",
        filters={"company": company, "branch": branch, **query_filters}
    )
```

### 4.6 RECOMMENDED: Notification Company Filter

Notifications MUST be filtered by company at query time:

```python
# Notification filter (CONCEPTUAL - for specification only)
def get_notifications(user, company):
    return frappe.get_list(
        "Notification",
        filters={"recipient": user, "company": company}
    )
```

---

## 5. Required Changes

### 5.1 Before Production (P0 - Blocking)

| # | Change | Owner | Priority | Status |
|---|--------|-------|----------|--------|
| 1 | Implement CompanyContext manager | Backend | P0 | REQUIRED |
| 2 | Implement CompanyIsolationMiddleware | Backend | P0 | REQUIRED |
| 3 | Audit all API endpoints for company filter | Backend | P0 | REQUIRED |
| 4 | Implement cache key namespacing | Backend | P0 | REQUIRED |
| 5 | Document company context flow | Architecture | P0 | REQUIRED |

### 5.2 Before Launch (P1 - High Priority)

| # | Change | Owner | Priority | Status |
|---|--------|-------|----------|--------|
| 6 | Implement AI data isolation | AI/Backend | P1 | REQUIRED |
| 7 | Implement search company filtering | Backend | P1 | REQUIRED |
| 8 | Implement notification company filtering | Backend | P1 | REQUIRED |
| 9 | Add company context validation to all widgets | Frontend | P1 | REQUIRED |
| 10 | Create Multi-Company integration test suite | QA | P1 | REQUIRED |

### 5.3 Post-Launch (P2 - Continuous)

| # | Change | Owner | Priority | Status |
|---|--------|-------|----------|--------|
| 11 | Automated company isolation tests in CI/CD | DevOps | P2 | RECOMMENDED |
| 12 | Quarterly architecture review | Architecture | P2 | RECOMMENDED |
| 13 | Developer training on Multi-Company patterns | Engineering | P2 | RECOMMENDED |

---

## 6. Validation by Area

### 6.1 API Requests

| Validation Point | Status | Notes |
|------------------|--------|-------|
| Every API includes company filter | REQUIRED | Must be enforced by middleware |
| Company from ERPNext session only | REQUIRED | Never from request body/params |
| Branch validation after company | REQUIRED | Cascading filter |
| Permission check per request | REQUIRED | Delegate to ERPNext |

**Risk Level:** HIGH — No current enforcement mechanism documented.

**Action:** Implement middleware before any API development.

---

### 6.2 Dashboard Widgets

| Validation Point | Status | Notes |
|------------------|--------|-------|
| Widget data scoped to company | REQUIRED | All queries include company filter |
| Widget displays company indicator | REQUIRED | Visual confirmation for users |
| Widget refresh respects company switch | REQUIRED | Instant update on change |
| No cross-company aggregation | REQUIRED | Even in "All Companies" view |

**Risk Level:** HIGH — Specifications mention context indicator but no enforcement.

**Action:** Add company validation to widget data layer.

---

### 6.3 Reports

| Validation Point | Status | Notes |
|------------------|--------|-------|
| Report queries include company | REQUIRED | Non-negotiable |
| Report exports scoped to company | REQUIRED | PDF/Excel must not leak data |
| Scheduled reports respect company | REQUIRED | Email reports scoped correctly |
| Report builder enforces company | REQUIRED | User cannot remove filter |

**Risk Level:** HIGH — Reports are highest risk for data leakage.

**Action:** Implement report-level company guard.

---

### 6.4 AI Insights

| Validation Point | Status | Notes |
|------------------|--------|-------|
| AI training data scoped to company | REQUIRED | No cross-company learning |
| AI insights tagged with company | REQUIRED | Traceability |
| AI recommendations company-specific | REQUIRED | No mixing |
| AI confidence scores per company | REQUIRED | Independent scoring |

**Risk Level:** HIGH — AI could inadvertently learn cross-company patterns.

**Action:** Implement company-scoped data pipelines for AI.

---

### 6.5 Search

| Validation Point | Status | Notes |
|------------------|--------|-------|
| Search index partitioned by company | REQUIRED | Physical or logical isolation |
| Search results filtered by company | REQUIRED | Query-time filter |
| Search suggestions company-scoped | REQUIRED | No cross-company suggestions |
| Global search respects company | REQUIRED | Even in "global" mode |

**Risk Level:** MEDIUM — Search is often overlooked in Multi-Company setups.

**Action:** Implement company-aware search index.

---

### 6.6 Notifications

| Validation Point | Status | Notes |
|------------------|--------|-------|
| Notification queries filter by company | REQUIRED | At database level |
| Notifications never cross company | REQUIRED | Even for system events |
| Push notifications scoped to company | REQUIRED | Mobile/desktop |
| Notification center company-filtered | REQUIRED | UI and API |

**Risk Level:** MEDIUM — Notification aggregation is common leakage point.

**Action:** Add company filter to notification queries.

---

### 6.7 Caching

| Validation Point | Status | Notes |
|------------------|--------|-------|
| Cache keys include company | REQUIRED | Namespace pattern |
| Cache invalidation on company switch | REQUIRED | Immediate |
| Cache isolation at infrastructure level | REQUIRED | Redis key pattern |
| No global cache for company data | REQUIRED | Prohibited |

**Risk Level:** HIGH — Cached data is most common leakage vector.

**Action:** Implement cache key standards and audit.

---

### 6.8 Permissions

| Validation Point | Status | Notes |
|------------------|--------|-------|
| ERPNext User Permissions respected | REQUIRED | Never bypass |
| Nexora never creates superuser bypass | REQUIRED | No backdoors |
| Role-based access inherits company | REQUIRED | Standard ERPNext pattern |
| Permission errors handled gracefully | REQUIRED | User-friendly messages |

**Risk Level:** HIGH — Permission bypass is critical vulnerability.

**Action:** Audit all permission checks, never use `ignore_permissions=True` without explicit reason.

---

### 6.9 Future Modules

| Module | Company Isolation Status | Risk | Action |
|--------|--------------------------|------|--------|
| Inventory Hub | PLANNED | Medium | Must inherit context |
| Purchase Hub | PLANNED | Medium | Must inherit context |
| Pricing Hub | PLANNED | Medium | Must inherit context |
| Supplier Hub | PLANNED | Medium | Must inherit context |
| Reports | PLANNED | High | Must enforce company filter |
| AI | PLANNED | High | Must scope training data |

**Rule:** All future modules MUST pass this validation checklist before development begins.

---

## 7. Future Risk Assessment

### 7.1 Identifiable Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Developer forgets company filter | HIGH | HIGH | Middleware enforcement |
| Cache key collision | MEDIUM | HIGH | Automated cache key audit |
| AI model cross-training | MEDIUM | HIGH | Data pipeline isolation |
| Report copy-paste error | MEDIUM | MEDIUM | Report templates with built-in filters |
| Third-party integration leakage | LOW | HIGH | Integration layer validation |
| Session fixation attack | LOW | HIGH | ERPNext session security |

### 7.2 Risk Mitigation Strategy

```
Layer 1: Prevention (Middleware)
    └── Enforces company on every request

Layer 2: Detection (Testing)
    └── Automated tests for cross-company leakage

Layer 3: Monitoring (Logging)
    └── Audit logs for company context access

Layer 4: Recovery (Incident Response)
    └── Data breach protocol if leakage occurs
```

---

## 8. Best Practices

### 8.1 Code Standards

1. **Never** hardcode company names or IDs
2. **Always** use `CompanyContext.get_active_company()`
3. **Never** bypass ERPNext permissions without explicit approval
4. **Always** include company in cache keys
5. **Never** aggregate data across companies without explicit user action
6. **Always** validate company access before data access
7. **Never** log company data without masking
8. **Always** test with multiple companies in QA

### 8.2 Database Standards

1. **Always** include `company` field in custom DocTypes
2. **Never** create indexes that ignore company
3. **Always** use ERPNext's `company` field permissions
4. **Never** create database views that cross companies

### 8.3 API Standards

1. **Always** accept company from session, never from request body
2. **Never** allow `company` parameter in POST/PUT requests
3. **Always** return company in API responses for verification
4. **Never** expose company IDs in URLs (use session)

---

## 9. Implementation Checklist

### 9.1 Backend (Python/Frappe)

- [ ] Create `nexora/company/context.py` with CompanyContext
- [ ] Create `nexora/api/middleware.py` with CompanyIsolationMiddleware
- [ ] Register middleware in all Nexora API routes
- [ ] Audit all `frappe.get_all` calls for company filter
- [ ] Audit all `frappe.get_list` calls for company filter
- [ ] Implement cache key namespacing standard
- [ ] Add company filter to all AI training data queries
- [ ] Add company filter to all search queries
- [ ] Add company filter to all notification queries
- [ ] Document company context flow in architecture docs

### 9.2 Frontend (JavaScript/React)

- [ ] Implement company context provider
- [ ] Add company indicator to all widgets
- [ ] Implement company switch handler with full refresh
- [ ] Add company validation to all API calls
- [ ] Implement cache invalidation on company switch

### 9.3 Testing

- [ ] Create Multi-Company test suite
- [ ] Test API endpoints with multiple companies
- [ ] Test widget data isolation
- [ ] Test report company filtering
- [ ] Test AI data scoping
- [ ] Test search results isolation
- [ ] Test notification filtering
- [ ] Test cache isolation
- [ ] Test permission enforcement
- [ ] Test company switch behavior

### 9.4 Documentation

- [ ] Document company context flow
- [ ] Document cache key standards
- [ ] Document AI data isolation
- [ ] Document developer guidelines
- [ ] Create Multi-Company runbook

---

## 10. Certification Result

### 10.1 Current Status

| Category | Status | Notes |
|----------|--------|-------|
| API Request Isolation | REQUIRES CHANGES | No middleware implemented |
| Dashboard Widget Isolation | REQUIRES CHANGES | No enforcement mechanism |
| Report Isolation | REQUIRES CHANGES | No company guard |
| AI Insight Isolation | REQUIRES CHANGES | No data scoping |
| Search Isolation | REQUIRES CHANGES | No company filter |
| Notification Isolation | REQUIRES CHANGES | No company filter |
| Cache Isolation | REQUIRES CHANGES | No namespacing standard |
| Permission Enforcement | REQUIRES CHANGES | No audit completed |
| Future Module Readiness | REQUIRES CHANGES | No guardrails in place |
| Documentation | REQUIRES CHANGES | No architecture docs |

### 10.2 Certification Decision

## ✗ CHANGES REQUIRED BEFORE CONTINUING DEVELOPMENT

**Reason:** While the architecture is fundamentally sound (ERPNext provides strong foundations), Nexora does not yet have enforced isolation mechanisms. Without the mandatory changes listed in Section 5.1, there is a HIGH risk of data leakage between companies.

### 10.3 Next Steps

1. **IMMEDIATE:** Implement CompanyContext and middleware (P0 items #1-2)
2. **THIS SPRINT:** Complete API audit and cache namespacing (P0 items #3-4)
3. **NEXT SPRINT:** Implement AI, search, and notification isolation (P1 items #6-8)
4. **BEFORE LAUNCH:** Complete full test suite and documentation (P1 items #9-10)

**Re-certification:** Required after all P0 and P1 items are completed.

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-24 | Initial Multi-Company validation report |

**Validated By:** Lead ERP Architect  
**Next Review:** After P0 and P1 changes implementation
