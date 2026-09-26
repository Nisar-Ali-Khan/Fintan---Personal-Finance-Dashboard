import { useState } from "react";
import { CATS_EXPENSE, CATS_INCOME } from "../utils/format";

export default function TransactionModal({ onClose, onSubmit }) {
  const [type, setType] = useState("expense");
  const [form, setForm] = useState({
    amount: "",
    category: CATS_EXPENSE[0],
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  function handleTypeChange(nextType) {
    setType(nextType);
    setForm((f) => ({ ...f, category: nextType === "income" ? CATS_INCOME[0] : CATS_EXPENSE[0] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || isNaN(parseFloat(form.amount))) return;
    onSubmit({
      id: Date.now(),
      type,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      note: form.note,
    });
  }

  const categories = type === "income" ? CATS_INCOME : CATS_EXPENSE;

  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Add transaction</h3>

        <div className="seg">
          <button
            type="button"
            className={type === "income" ? "active inc" : ""}
            onClick={() => handleTypeChange("income")}
          >
            Income
          </button>
          <button
            type="button"
            className={type === "expense" ? "active exp" : ""}
            onClick={() => handleTypeChange("expense")}
          >
            Expense
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Note (optional)</label>
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="e.g. groceries, client invoice"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Add {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
