export default function Topbar({ title, subtitle, theme, onToggleTheme, onExport, onAddClick }) {
  const themeLabel = theme === "auto" ? "Auto" : theme === "dark" ? "Dark" : "Light";

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <div className="sub">{subtitle}</div>
      </div>
      <div className="topbar-actions">
        <button className="btn" onClick={onToggleTheme}>
          {themeLabel}
        </button>
        <button className="btn" onClick={onExport}>
          Export CSV
        </button>
        <button className="btn primary" onClick={onAddClick}>
          + Add transaction
        </button>
      </div>
    </div>
  );
}
