import * as React from "react";
import clsx from "clsx";
import { authColors } from "@/theme/authTheme";
import "@/theme/authForm.css";

export type AuthFormShellProps = {
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export const authFormSubmitButtonStyle = {
  "--background-color": authColors.primary,
  "--border-radius": "12px",
  fontWeight: 600,
  marginTop: 8,
} as React.CSSProperties;

export function AuthFormShell({ hint, className, children }: AuthFormShellProps) {
  return (
    <div className={clsx("auth-mobile-form", className)}>
      {hint ? <p className="auth-form-hint">{hint}</p> : null}
      {children}
    </div>
  );
}
