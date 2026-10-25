import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getMostPopularRepositories } from "../utils/dataTransform";

export default function PopularReposChart({ repositories = [] }) {
  const data = getMostPopularRepositories(repositories, 8);

  return (
    <section className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
      <h2 className="text-lg font-semibold text-white">Repository popularity</h2>
      <p className="mt-1 text-sm text-github-muted">Stars and forks for the most starred repositories in the retrieved list.</p>

      {data.length === 0 ? (
        <p className="mt-6 text-sm text-github-muted">
          No retrieved repositories are available to compare.
        </p>
      ) : (
        <div className="mt-4 h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke="#30363d" horizontal={false} />
              <XAxis type="number" stroke="#8b949e" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={96}
                stroke="#8b949e"
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => [`${value} stars`, "Stars"]}
                contentStyle={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  color: "#e6edf3",
                }}
              />
              <Tooltip formatter={(value, name) => [`${value}`, name === "stars" ? "Stars" : "Forks"]} contentStyle={{backgroundColor:"#161b22",border:"1px solid #30363d",color:"#e6edf3"}} />
              <Bar dataKey="stars" name="Stars" fill="#58a6ff" radius={[0, 4, 4, 0]} />
              <Bar dataKey="forks" name="Forks" fill="#3fb950" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
