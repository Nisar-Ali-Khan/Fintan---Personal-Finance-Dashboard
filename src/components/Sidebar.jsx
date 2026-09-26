const NAV_ITEMS = [
  ["overview", "Overview"],
  ["transactions", "Transactions"],
  ["budgets", "Budgets"],
  ["reports", "Reports"],
];

export default function Sidebar({ page, onNavigate }) {
  return (
    <div className="sidebar">
      <div className="brand">Fintan</div>
      {NAV_ITEMS.map(([id, label]) => (
        <button
          key={id}
          className={"nav-btn" + (page === id ? " active" : "")}
          onClick={() => onNavigate(id)}
        >
          <span className="nav-dot" />
          {label}
        </button>
      ))}
      <div className="sidebar-foot">Local-only · data stays in this browser</div>
    </div>
  );
}

export { NAV_ITEMS };
