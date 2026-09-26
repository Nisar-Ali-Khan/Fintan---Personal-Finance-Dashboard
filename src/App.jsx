import { useEffect, useMemo, useState } from "react";
import Sidebar, { NAV_ITEMS } from "./components/Sidebar";
import Topbar from "./components/Topbar";
import KpiCards from "./components/KpiCards";
import TransactionModal from "./components/TransactionModal";
import OverviewPage from "./pages/OverviewPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import ReportsPage from "./pages/ReportsPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { CATS_EXPENSE, exportTransactionsToCSV, monthKey } from "./utils/format";

export default function App() {
  const [transactions, setTransactions] = useLocalStorage("fintan_tx_v2", []);
  const [budgets, setBudgets] = useLocalStorage("fintan_budget_v2", {});
  const [theme, setTheme] = useLocalStorage("fintan_theme_v2", "auto");
  const [page, setPage] = useState("overview");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "auto" ? "" : theme);
  }, [theme]);

  const thisMonth = new Date().toISOString().slice(0, 7);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => (t.type === "income" ? (income += t.amount) : (expense += t.amount)));
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const monthTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions
      .filter((t) => monthKey(t.date) === thisMonth)
      .forEach((t) => (t.type === "income" ? (income += t.amount) : (expense += t.amount)));
    return { income, expense };
  }, [transactions, thisMonth]);

  const byCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => (map[t.category] = (map[t.category] || 0) + t.amount));
    return map;
  }, [transactions]);

  const byMonth = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = monthKey(t.date);
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return Object.keys(map)
      .sort()
      .slice(-6)
      .reduce((acc, key) => ({ ...acc, [key]: map[key] }), {});
  }, [transactions]);

  const monthExpenseByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense" && monthKey(t.date) === thisMonth)
      .forEach((t) => (map[t.category] = (map[t.category] || 0) + t.amount));
    return map;
  }, [transactions, thisMonth]);

  function addTransaction(tx) {
    setTransactions([tx, ...transactions]);
    setModalOpen(false);
  }

  function removeTransaction(id) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  function setCategoryBudget(category, value) {
    setBudgets({ ...budgets, [category]: parseFloat(value) || 0 });
  }

  function cycleTheme() {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "auto" : "dark");
  }

  const pageTitle = NAV_ITEMS.find(([id]) => id === page)?.[1] ?? "";

  return (
    <div className="app">
      <Sidebar page={page} onNavigate={setPage} />

      <div className="main">
        <Topbar
          title={pageTitle}
          subtitle={`${thisMonth} · ${transactions.length} transactions on record`}
          theme={theme}
          onToggleTheme={cycleTheme}
          onExport={() => exportTransactionsToCSV(transactions)}
          onAddClick={() => setModalOpen(true)}
        />

        <KpiCards totals={totals} monthTotals={monthTotals} />

        {page === "overview" && <OverviewPage byCategory={byCategory} byMonth={byMonth} />}

        {page === "transactions" && (
          <TransactionsPage transactions={transactions} onRemove={removeTransaction} />
        )}

        {page === "budgets" && (
          <BudgetsPage
            monthLabel={thisMonth}
            monthExpenseByCategory={monthExpenseByCategory}
            budgets={budgets}
            onSetBudget={setCategoryBudget}
          />
        )}

        {page === "reports" && <ReportsPage byMonth={byMonth} />}
      </div>

      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} onSubmit={addTransaction} />}
    </div>
  );
}
