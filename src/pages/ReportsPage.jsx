import { formatCurrency } from "../utils/format";

export default function ReportsPage({ byMonth }) {
  const months = Object.keys(byMonth).slice().reverse();

  return (
    <div className="panel">
      <h2>Monthly report</h2>
      {months.length === 0 ? (
        <div className="empty">No transactions yet.</div>
      ) : (
        months.map((m) => (
          <div key={m} className="budget-row">
            <div className="bhead">
              <span className="serif" style={{ fontWeight: 600 }}>
                {m}
              </span>
              <span className="num">Net {formatCurrency(byMonth[m].income - byMonth[m].expense)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem", color: "var(--sub)" }}>
              <span className="income num">Income {formatCurrency(byMonth[m].income)}</span>
              <span className="expense num">Expense {formatCurrency(byMonth[m].expense)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
