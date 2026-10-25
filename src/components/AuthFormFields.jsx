import { useState } from "react";

export default function AuthFormFields({
  email,
  password,
  confirmPassword,
  onEmailChange,
  onPasswordChange,
  onConfirmChange,
  showConfirm = false,
  error,
  submitLabel,
  isSubmitting,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-github-text" htmlFor="auth-email">
        Email
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-github-border bg-[#0d1117] px-4 py-3 text-github-text outline-none transition focus:border-github-link focus:ring-2 focus:ring-github-link/30"
        />
      </label>

      <label className="block text-sm font-medium text-github-text" htmlFor="auth-password">
        Password
        <div className="relative mt-2">
          <input
            id="auth-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={showConfirm ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-github-border bg-[#0d1117] px-4 py-3 pr-20 text-github-text outline-none transition focus:border-github-link focus:ring-2 focus:ring-github-link/30"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-github-link"
            onClick={() => setShowPassword((open) => !open)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>

      {showConfirm && (
        <label className="block text-sm font-medium text-github-text" htmlFor="auth-confirm">
          Confirm password
          <input
            id="auth-confirm"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => onConfirmChange(event.target.value)}
            placeholder="Re-enter your password"
            className="mt-2 w-full rounded-xl border border-github-border bg-[#0d1117] px-4 py-3 text-github-text outline-none transition focus:border-github-link focus:ring-2 focus:ring-github-link/30"
          />
        </label>
      )}

      {error && (
        <p className="rounded-xl border border-github-danger/40 bg-github-danger/10 px-3 py-2 text-sm text-github-danger" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-[#238636] to-[#2ea043] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition hover:from-[#2ea043] hover:to-[#3fb950] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Please wait..." : submitLabel}
      </button>
    </div>
  );
}
