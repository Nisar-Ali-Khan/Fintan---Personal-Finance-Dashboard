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

const DEMO_BUDGETS = {
  Food: 700,
  Transport: 240,
  Housing: 1800,
  Utilities: 380,
  Entertainment: 260,
  Health: 210,
  Shopping: 320,
  Other: 180,
};

const DEMO_TRANSACTIONS = [
  { id: 1, date: "2026-09-01", type: "income", category: "Salary", amount: 4200, note: "Monthly salary" },
  { id: 2, date: "2026-09-02", type: "expense", category: "Housing", amount: 1450, note: "Rent" },
  { id: 3, date: "2026-09-04", type: "expense", category: "Food", amount: 118.45, note: "Groceries" },
  { id: 4, date: "2026-09-05", type: "expense", category: "Transport", amount: 82.3, note: "Fuel + commuting" },
  { id: 5, date: "2026-09-08", type: "expense", category: "Utilities", amount: 186.8, note: "Electricity and water" },
  { id: 6, date: "2026-09-10", type: "expense", category: "Entertainment", amount: 96.5, note: "Streaming and cinema" },
  { id: 7, date: "2026-09-12", type: "income", category: "Freelance", amount: 650, note: "Website redesign" },
  { id: 8, date: "2026-09-15", type: "expense", category: "Shopping", amount: 142.99, note: "Home essentials" },
  { id: 9, date: "2026-09-18", type: "expense", category: "Health", amount: 75, note: "Pharmacy" },
  { id: 10, date: "2026-09-20", type: "expense", category: "Food", amount: 64.2, note: "Dinner with friends" },
  { id: 11, date: "2026-09-22", type: "income", category: "Investment", amount: 210.32, note: "Dividends" },
  { id: 12, date: "2026-08-03", type: "expense", category: "Food", amount: 135.7, note: "Supermarket trip" },
  { id: 13, date: "2026-08-05", type: "expense", category: "Transport", amount: 91.25, note: "Train pass" },
  { id: 14, date: "2026-08-09", type: "expense", category: "Housing", amount: 1450, note: "Rent" },
  { id: 15, date: "2026-08-12", type: "income", category: "Salary", amount: 4200, note: "Monthly salary" },
  { id: 16, date: "2026-08-17", type: "expense", category: "Entertainment", amount: 120.4, note: "Concert tickets" },
  { id: 17, date: "2026-08-22", type: "expense", category: "Shopping", amount: 198.6, note: "Clothing" },
  { id: 18, date: "2026-07-02", type: "income", category: "Salary", amount: 4200, note: "Monthly salary" },
  { id: 19, date: "2026-07-04", type: "expense", category: "Food", amount: 154.1, note: "Groceries" },
  { id: 20, date: "2026-07-10", type: "expense", category: "Utilities", amount: 170.2, note: "Internet and power" },
  { id: 21, date: "2026-07-14", type: "expense", category: "Health", amount: 90, note: "Clinic visit" },
  { id: 22, date: "2026-07-19", type: "expense", category: "Transport", amount: 74.8, note: "Fuel" },
  { id: 23, date: "2026-06-02", type: "income", category: "Salary", amount: 4200, note: "Monthly salary" },
  { id: 24, date: "2026-06-06", type: "expense", category: "Housing", amount: 1450, note: "Rent" },
  { id: 25, date: "2026-06-11", type: "expense", category: "Food", amount: 162.9, note: "Bulk groceries" },
  { id: 26, date: "2026-06-16", type: "expense", category: "Entertainment", amount: 81.3, note: "Board games" },
  { id: 27, date: "2026-06-24", type: "income", category: "Freelance", amount: 540, note: "Landing page fix" },
  { id: 28, date: "2026-05-01", type: "income", category: "Salary", amount: 4200, note: "Monthly salary" },
  { id: 29, date: "2026-05-04", type: "expense", category: "Food", amount: 148.65, note: "Weekly groceries" },
  { id: 30, date: "2026-05-12", type: "expense", category: "Utilities", amount: 178.45, note: "Gas and internet" },
  { id: 31, date: "2026-05-21", type: "expense", category: "Shopping", amount: 230.5, note: "Desk setup" },
  { id: 32, date: "2026-05-26", type: "expense", category: "Transport", amount: 95.8, note: "Public transit" },
];

export default function App() {
  const [transactions, setTransactions] = useLocalStorage("fintan_tx_v2", DEMO_TRANSACTIONS);
  const [budgets, setBudgets] = useLocalStorage("fintan_budget_v2", DEMO_BUDGETS);
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
