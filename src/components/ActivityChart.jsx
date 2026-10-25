import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

export default function ActivityChart({ activity, isLoading, isError, onRetry }) {
  return (
    <section className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
      <h2 className="text-lg font-semibold text-white">Public activity</h2>
      <p className="mt-1 text-sm text-github-muted">
        Counts of recent public events from GitHub&apos;s events API. This is not a
        contribution graph and does not invent commit totals.
      </p>

      {isLoading && (
        <div className="mt-6">
          <Loading message="Loading public activity..." />
        </div>
      )}

      {isError && (
        <div className="mt-6">
          <ErrorMessage
            message="Public activity could not be loaded. The events endpoint may be limited or unavailable."
            onRetry={onRetry}
          />
        </div>
      )}

      {!isLoading && !isError && activity.length === 0 && (
        <p className="mt-6 text-sm text-github-muted">
          No recent public events are available for this user.
        </p>
      )}

      {!isLoading && !isError && activity.length > 0 && (
        <div className="mt-4 h-64 min-w-0 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activity} margin={{ left: 0, right: 8 }}>
              <CartesianGrid stroke="#30363d" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#8b949e"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis allowDecimals={false} stroke="#8b949e" tick={{ fontSize: 12 }} width={32} />
              <Tooltip
                formatter={(value) => [`${value} events`, "Activity"]}
                contentStyle={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  color: "#e6edf3",
                }}
              />
              <Bar dataKey="count" fill="#58a6ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
