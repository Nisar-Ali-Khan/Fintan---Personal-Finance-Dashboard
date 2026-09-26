import { useMemo, useState } from "react";
import { CATS_EXPENSE, CATS_INCOME, formatCurrency } from "../utils/format";

const ALL_CATS = [...new Set([...CATS_INCOME, ...CATS_EXPENSE])];

export default function TransactionsPage({ transactions, onRemove }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCat, setFilterCat] = useState("All");

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (filterType === "All" || t.type === filterType) &&
          (filterCat === "All" || t.category === filterCat) &&
          (!search ||
            (t.note || "").toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase()))
      ),
    [transactions, search, filterType, filterCat]
  );

  return (
    <div className="panel">
      <div className="filters">
        <input
          placeholder="Search note or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 200 }}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option>All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option>All</option>
          {ALL_CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No matching transactions.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="num">{t.date}</td>
                <td>{t.note || "—"}</td>
                <td>
                  <span className="tag-pill">{t.category}</span>
                </td>
                <td className={"num amt " + t.type} style={{ textAlign: "right" }}>
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button className="del" onClick={() => onRemove(t.id)}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
