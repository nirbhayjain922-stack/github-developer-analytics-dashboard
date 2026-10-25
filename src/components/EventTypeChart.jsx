import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calculateEventTypeDistribution } from "../utils/dataTransform";

export default function EventTypeChart({ events = [] }) {
  const data = calculateEventTypeDistribution(events);
  return <section className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6"><h2 className="text-lg font-semibold text-white">Public event types</h2><p className="mt-1 text-sm text-github-muted">Event counts in the recent public events returned by GitHub.</p>
    {!data.length ? <p className="mt-5 text-sm text-github-muted">No event type data is available.</p> : <div className="mt-4 h-72 min-w-0" role="img" aria-label="Bar chart of recent public GitHub event counts by event type"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.slice(0, 8)} layout="vertical" margin={{ left: 10, right: 16 }}><CartesianGrid stroke="#30363d" horizontal={false}/><XAxis type="number" allowDecimals={false} stroke="#8b949e"/><YAxis type="category" dataKey="name" width={120} stroke="#8b949e" tick={{fontSize: 10}}/><Tooltip contentStyle={{backgroundColor:"#161b22",border:"1px solid #30363d",color:"#e6edf3"}}/><Bar dataKey="value" name="Events" fill="#3fb950" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></div>}
  </section>;
}
