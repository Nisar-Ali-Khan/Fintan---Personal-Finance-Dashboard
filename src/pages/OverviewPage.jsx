import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PALETTE = ["#A6462C", "#B8863A", "#3E6B52", "#6E6659", "#7A8FA6", "#8A5A8C", "#C97A5A", "#4A6B8A"];

export default function OverviewPage({ byCategory, byMonth }) {
  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(byMonth).map(([month, v]) => ({
    month,
    Income: v.income,
    Expense: v.expense,
  }));

  return (
    <div className="grid2">
      <div className="panel">
        <h2>Spending by category</h2>
        {pieData.length === 0 ? (
          <div className="empty">No expenses yet — add a transaction to see the breakdown.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="panel">
        <h2>Income vs. expense, last 6 months</h2>
        {barData.length === 0 ? (
          <div className="empty">No data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="month" stroke="var(--sub)" fontSize={11} />
              <YAxis stroke="var(--sub)" fontSize={11} />
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Income" fill="var(--income)" />
              <Bar dataKey="Expense" fill="var(--expense)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
