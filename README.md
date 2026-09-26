# Fintan — Personal Finance Dashboard

A local-first personal finance dashboard for tracking income, expenses, budgets,
and monthly trends — built with React and Recharts, with all data persisted
to `localStorage` (no backend required).

## Features

- **Income & expense tracking** — log transactions with category, date, and notes
- **Overview dashboard** — category-wise spending doughnut chart and a 6-month
  income vs. expense bar chart (Recharts)
- **Budget analysis** — set a monthly spending cap per category, with progress
  bars that flag overspend
- **Monthly reports** — income, expense, and net totals broken down by month
- **Search & filter** — filter the transaction ledger by type, category, or note
- **CSV export** — download all transactions as a `.csv` file
- **Light / dark / system theme**, fully responsive down to mobile

## Tech stack

- [React 18](https://react.dev/) with hooks (`useState`, `useEffect`, `useMemo`)
- [Recharts](https://recharts.org/) for data visualization
- [Vite](https://vitejs.dev/) for the dev server and build
- Plain CSS with custom properties for theming — no CSS framework dependency

## Project structure

```
src/
├── components/       # Reusable UI: Sidebar, Topbar, KpiCards, TransactionModal
├── pages/            # Route-level views: Overview, Transactions, Budgets, Reports
├── hooks/
│   └── useLocalStorage.js   # Generic hook for persisting state to localStorage
├── utils/
│   └── format.js     # Currency formatting, category constants, CSV export
├── App.jsx           # Top-level state and layout
├── main.jsx          # React entry point
└── index.css         # Design tokens and global styles
```

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build
npm run preview    # preview the production build locally
```

## Notes

All data is stored in the browser's `localStorage` — nothing is sent to a
server, so it's suitable as a fully client-side demo or as a starting point
for a version backed by a real API.
