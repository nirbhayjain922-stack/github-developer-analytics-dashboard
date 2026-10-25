import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#58a6ff",
  "#3fb950",
  "#d2a8ff",
  "#f85149",
  "#d29922",
  "#79c0ff",
  "#ffa198",
  "#7ee787",
];

export default function LanguageChart({ data }) {
  if (!data?.length) {
    return (
      <section className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold text-white">Language distribution</h2>
        <p className="mt-3 text-sm text-github-muted">
          No repository language data is available for this developer.
        </p>
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
      <h2 className="text-lg font-semibold text-white">Language distribution</h2>
      <p className="mt-1 text-sm text-github-muted">
        Calculated from the primary language of each retrieved public repository.
      </p>
      <div className="mt-4 h-64 min-w-0 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, item) => [
                `${value} repos (${item.payload.percent}%)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                color: "#e6edf3",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
        {data.slice(0, 8).map((item, index) => (
          <li key={item.name} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="shrink-0 text-github-muted">{item.percent}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
