export const CATS_EXPENSE = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Other",
];

export const CATS_INCOME = ["Salary", "Freelance", "Investment", "Gift", "Other"];

export function formatCurrency(n) {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function monthKey(dateStr) {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

export function exportTransactionsToCSV(transactions) {
  const rows = [
    ["Date", "Type", "Category", "Note", "Amount"],
    ...transactions.map((t) => [t.date, t.type, t.category, t.note || "", t.amount]),
  ];
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}
