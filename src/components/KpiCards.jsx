import { formatCurrency } from "../utils/format";

export default function KpiCards({ totals, monthTotals }) {
  return (
    <div className="kpis">
      <div className="kpi">
        <div className="label">Net balance</div>
        <div className="value num">{formatCurrency(totals.balance)}</div>
      </div>
      <div className="kpi">
        <div className="label">Total income</div>
        <div className="value income num">{formatCurrency(totals.income)}</div>
      </div>
      <div className="kpi">
        <div className="label">Total expenses</div>
        <div className="value expense num">{formatCurrency(totals.expense)}</div>
      </div>
      <div className="kpi">
        <div className="label">This month, net</div>
        <div className="value num">
          {formatCurrency(monthTotals.income - monthTotals.expense)}
        </div>
        <div className="delta">
          Income {formatCurrency(monthTotals.income)} · Spent {formatCurrency(monthTotals.expense)}
        </div>
      </div>
    </div>
  );
}
