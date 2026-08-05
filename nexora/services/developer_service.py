# -*- coding: utf-8 -*-
import os
import json
import zipfile
import shutil
import subprocess
import datetime
from pathlib import Path

import frappe
from frappe.utils import now_datetime, get_datetime


class DeveloperService:
    BASE_DIR = frappe.get_app_path("nexora")
    BACKUP_DIR = os.path.join(BASE_DIR, "backups")
    UPDATE_HISTORY_FILE = os.path.join(BASE_DIR, "update-history.json")

    @staticmethod
    def verify_environment():
        result = {
            "git_installed": False,
            "docker_running": False,
            "internet_available": False,
            "github_reachable": False,
            "current_branch": None,
            "working_tree_status": None,
            "errors": [],
        }

        try:
            git_version = subprocess.run(["git", "--version"], capture_output=True, text=True, shell=False)
            result["git_installed"] = git_version.returncode == 0
            if not result["git_installed"]:
                result["errors"].append("Git is not installed")
        except Exception as e:
            result["errors"].append(f"Git check failed: {str(e)}")

        try:
            docker_version = subprocess.run(["docker", "--version"], capture_output=True, text=True, shell=False)
            result["docker_running"] = docker_version.returncode == 0
            if not result["docker_running"]:
                result["errors"].append("Docker is not running")
        except Exception as e:
            result["errors"].append(f"Docker check failed: {str(e)}")

        try:
            import urllib.request
            urllib.request.urlopen("https://www.google.com", timeout=5)
            result["internet_available"] = True
        except Exception:
            result["errors"].append("Internet is not available")

        try:
            import urllib.request
            req = urllib.request.Request("https://github.com", method="HEAD")
            urllib.request.urlopen(req, timeout=5)
            result["github_reachable"] = True
        except Exception:
            result["errors"].append("GitHub is not reachable")

        try:
            branch = subprocess.run(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            if branch.returncode == 0:
                result["current_branch"] = branch.stdout.strip()
            else:
                result["errors"].append("Could not determine current branch")
        except Exception as e:
            result["errors"].append(f"Branch check failed: {str(e)}")

        try:
            status = subprocess.run(
                ["git", "status", "--porcelain"],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            if status.returncode == 0:
                result["working_tree_status"] = status.stdout.strip().splitlines() if status.stdout.strip() else []
            else:
                result["errors"].append("Could not get working tree status")
        except Exception as e:
            result["errors"].append(f"Working tree check failed: {str(e)}")

        result["all_passed"] = len(result["errors"]) == 0
        return result

    @staticmethod
    def create_backup(source_paths, backup_dir=None):
        if backup_dir is None:
            backup_dir = DeveloperService.BACKUP_DIR

        os.makedirs(backup_dir, exist_ok=True)
        timestamp = now_datetime().strftime("%Y%m%d_%H%M%S")
        backup_name = f"backup_{timestamp}"
        backup_path = os.path.join(backup_dir, f"{backup_name}.zip")

        with zipfile.ZipFile(backup_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for src in source_paths:
                if os.path.exists(src):
                    if os.path.isdir(src):
                        for root, dirs, files in os.walk(src):
                            for file in files:
                                file_path = os.path.join(root, file)
                                arcname = os.path.relpath(file_path, start=os.path.dirname(src))
                                try:
                                    zf.write(file_path, arcname)
                                except Exception:
                                    pass
                    else:
                        try:
                            zf.write(src, os.path.basename(src))
                        except Exception:
                            pass

        backup_size = os.path.getsize(backup_path)
        return {
            "backup_name": backup_name,
            "backup_path": backup_path,
            "backup_size": backup_size,
        }

    @staticmethod
    def get_git_status():
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            if result.returncode != 0:
                return {"success": False, "error": result.stderr.strip()}
            files = [line.strip() for line in result.stdout.strip().splitlines() if line.strip()]
            return {"success": True, "files": files, "count": len(files)}
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def git_add_all():
        try:
            result = subprocess.run(
                ["git", "add", "."],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def git_commit(message):
        try:
            result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            if result.returncode != 0:
                return {"success": False, "error": result.stderr.strip()}

            hash_result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            commit_hash = hash_result.stdout.strip() if hash_result.returncode == 0 else "unknown"
            return {"success": True, "commit_hash": commit_hash, "output": result.stdout.strip()}
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def git_push(branch):
        try:
            result = subprocess.run(
                ["git", "push", "origin", branch],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            return {
                "success": result.returncode == 0,
                "output": result.stdout.strip(),
                "error": result.stderr.strip(),
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def git_create_tag(tag_name, message):
        try:
            tag_result = subprocess.run(
                ["git", "tag", "-a", tag_name, "-m", message],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            if tag_result.returncode != 0:
                return {"success": False, "error": tag_result.stderr.strip()}

            push_result = subprocess.run(
                ["git", "push", "origin", tag_name],
                cwd=DeveloperService.BASE_DIR,
                capture_output=True,
                text=True,
                shell=False,
            )
            return {
                "success": push_result.returncode == 0,
                "output": push_result.stdout.strip(),
                "error": push_result.stderr.strip(),
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def write_update_history(record):
        history = []
        if os.path.exists(DeveloperService.UPDATE_HISTORY_FILE):
            try:
                with open(DeveloperService.UPDATE_HISTORY_FILE, "r", encoding="utf-8") as f:
                    history = json.load(f)
            except Exception:
                history = []

        history.append(record)
        try:
            with open(DeveloperService.UPDATE_HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(history, f, indent=2, ensure_ascii=False)
        except Exception as e:
            frappe.log_error(f"Failed to write update history: {str(e)}", "Developer Center")

    @staticmethod
    def get_update_history(filters=None):
        if not os.path.exists(DeveloperService.UPDATE_HISTORY_FILE):
            return []
        try:
            with open(DeveloperService.UPDATE_HISTORY_FILE, "r", encoding="utf-8") as f:
                history = json.load(f)
            if filters:
                filtered = []
                for record in history:
                    match = True
                    for key, value in filters.items():
                        if value and record.get(key) != value:
                            match = False
                            break
                    if match:
                        filtered.append(record)
                return filtered
            return history
        except Exception:
            return []

    @staticmethod
    def list_backups(backup_dir=None):
        if backup_dir is None:
            backup_dir = DeveloperService.BACKUP_DIR
        if not os.path.exists(backup_dir):
            return []
        backups = []
        for file in os.listdir(backup_dir):
            if file.endswith(".zip"):
                file_path = os.path.join(backup_dir, file)
                stat = os.stat(file_path)
                backups.append({
                    "backup_name": file.replace(".zip", ""),
                    "backup_file_path": file_path,
                    "backup_size": stat.st_size,
                    "creation_date": datetime.datetime.fromtimestamp(stat.st_ctime).isoformat(),
                })
        backups.sort(key=lambda x: x["creation_date"], reverse=True)
        return backups

    @staticmethod
    def restore_backup(backup_file_path):
        if not os.path.exists(backup_file_path):
            return {"success": False, "error": "Backup file not found"}
        try:
            extract_dir = os.path.join(DeveloperService.BASE_DIR, "restore_temp")
            if os.path.exists(extract_dir):
                shutil.rmtree(extract_dir)
            os.makedirs(extract_dir, exist_ok=True)
            with zipfile.ZipFile(backup_file_path, "r") as zf:
                zf.extractall(extract_dir)
            return {"success": True, "extract_path": extract_dir}
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def delete_backup(backup_file_path):
        if not os.path.exists(backup_file_path):
            return {"success": False, "error": "Backup file not found"}
        try:
            os.remove(backup_file_path)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def get_next_version(current_version):
        if not current_version:
            return "v1.0.1"
        parts = current_version.lstrip("v").split(".")
        if len(parts) < 3:
            parts = (parts + ["0", "0", "0"])[:3]
        try:
            parts[-1] = str(int(parts[-1]) + 1)
        except ValueError:
            parts[-1] = "1"
        return f"v{'.'.join(parts)}"
