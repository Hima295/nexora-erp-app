export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  children?: FileNode[];
}

export interface ValidationCheck {
  title: string;
  category: string;
  passed: boolean;
  details: string;
}

export interface ValidationResult {
  success: boolean;
  score: number;
  total_checks: number;
  passed_checks: number;
  checks: ValidationCheck[];
}

export interface BenchCommand {
  label: string;
  command: string;
  description: string;
}

export type LanguageMode = "ar" | "en";

export interface AppTranslations {
  [key: string]: string;
}
