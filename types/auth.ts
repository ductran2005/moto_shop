import type { LucideIcon } from "lucide-react";

export interface FeatureBadgeItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export interface FooterTrustItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export interface LoginFormCopy {
  headingLead: string;
  headingAccent: string;
  subtitle: string;
  identifierPlaceholder: string;
  passwordPlaceholder: string;
  rememberLabel: string;
  forgotPasswordLabel: string;
  submitLabel: string;
  dividerLabel: string;
  registerPrompt: string;
  registerLabel: string;
}

