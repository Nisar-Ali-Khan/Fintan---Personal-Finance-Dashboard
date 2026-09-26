import { useState } from "react";
import { CATS_EXPENSE, formatCurrency } from "../utils/format";

export default function BudgetsPage({ monthLabel, monthExpenseByCategory, budgets, onSetBudget }) {
  const [category, setCategory] = useState(CATS_EXPENSE[0]);
  const [amount, setAmount] = useState("");

  function handleSet() {
    onSetBudget(category, amount);
    setAmount("");
  }

  return (
    <div className="panel">
      <h2>Monthly budget by category ({monthLabel})</h2>

      {CATS_EXPENSE.map((cat) => {
        const spent = monthExpenseByCategory[cat] || 0;
        const budget = budgets[cat] || 0;
        const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
        const over = budget > 0 && spent > budget;

        return (
          <div className="budget-row" key={cat}>
            <div className="bhead">
              <span>{cat}</span>
              <span className="num">
                {formatCurrency(spent)}
                {budget > 0 && <span style={{ color: "var(--sub)" }}> / {formatCurrency(budget)}</span>}
              </span>
            </div>
            <div className="bar-bg">
              <div className={"bar-fill" + (over ? " over" : "")} style={{ width: `${budget > 0 ? pct : 0}%` }} />
            </div>
          </div>
        );
      })}

      <div className="mini-input">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATS_EXPENSE.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="Set monthly budget"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn" onClick={handleSet}>
          Set
        </button>
      </div>
    </div>
  );
}
