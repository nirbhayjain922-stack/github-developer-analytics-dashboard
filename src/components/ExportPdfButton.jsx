import { useState } from "react";
import { exportElementToPdf } from "../utils/exportPdf";

export default function ExportPdfButton({
  targetRef,
  filename,
  disabled = false,
  label = "Export PDF",
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async () => {
    if (!targetRef?.current || disabled) {
      return;
    }

    setIsExporting(true);
    setError("");

    try {
      await exportElementToPdf(targetRef.current, filename);
    } catch (exportError) {
      setError(exportError.message || "Unable to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleExport}
        disabled={disabled || isExporting}
        aria-label={`${label}${disabled ? ": no loaded report data" : ""}`}
        className="inline-flex items-center justify-center rounded-lg border border-github-border bg-github-card px-4 py-2.5 text-sm font-semibold text-white transition hover:border-github-link hover:bg-github-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExporting ? "Preparing PDF..." : label}
      </button>
      {error && (
        <p className="text-xs text-github-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
