import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  initialValue = "",
  buttonLabel = "Analyze",
  inputId = "github-username",
  onSubmitUsername,
  isBusy = false,
}) {
  const [username, setUsername] = useState(initialValue);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(initialValue);
  }, [initialValue]);

  const trimmedInput = username.trim();
  const isSameRequestBusy =
    isBusy && trimmedInput.toLowerCase() === String(initialValue).trim().toLowerCase();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSameRequestBusy) {
      return;
    }

    const trimmed = trimmedInput;

    if (!trimmed) {
      setValidationError("Please enter a GitHub username.");
      return;
    }

    if (!/^[a-zA-Z0-9-]{1,39}$/.test(trimmed)) {
      setValidationError("Use a GitHub username with up to 39 letters, numbers, or hyphens.");
      return;
    }

    setValidationError("");

    if (onSubmitUsername) {
      onSubmitUsername(trimmed);
      return;
    }

    navigate(`/dashboard/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          GitHub username
        </label>
        <input
          id={inputId}
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? `${inputId}-error` : undefined}
          onChange={(event) => {
            setUsername(event.target.value);
            if (validationError) {
              setValidationError("");
            }
          }}
          placeholder="Enter GitHub username"
          className="control-field bg-github-card disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSameRequestBusy}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-github-success px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSameRequestBusy ? "Loading..." : buttonLabel}
        </button>
      </div>
      {validationError && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-github-danger" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
