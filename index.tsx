import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LayoutDashboard, Pill, Tags, ShoppingCart, TrendingUp, Users, CreditCard, FileText, Settings,
  Search, Globe, ChevronDown, Download, Menu, X, DollarSign, Package, Boxes, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Cross,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sales Overview — MediCare Pharmacy Dashboard" },
      { name: "description", content: "Track pharmacy sales, orders, stock and top-selling medicines at a glance." },
      { property: "og:title", content: "Sales Overview — MediCare Pharmacy Dashboard" },
      { property: "og:description", content: "Track pharmacy sales, orders, stock and top-selling medicines at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const nav = [
  { label: "Main Menu", items: [["Dashboard", LayoutDashboard], ["Products", Pill], ["Categories", Tags]] },
  { label: "Management", items: [["Orders", ShoppingCart], ["Sales", TrendingUp], ["Customers", Users]] },
  { label: "Administration", items: [["Payments", CreditCard], ["Reports", FileText], ["Settings", Settings]] },
] as const;

const metrics = [
  { title: "Total Sales", value: "$48,320", change: 12.4, note: "vs last month", icon: DollarSign },
  { title: "Total Orders", value: "1,284", change: 8.1, note: "vs last month", icon: ShoppingCart },
  { title: "Total Products", value: "642", change: 2.3, note: "active SKUs", icon: Package },
  { title: "Total Stock", value: "18,905", change: -3.6, note: "units on hand", icon: Boxes },
];

const categories = [
  { name: "Prescription", value: 42, color: "var(--chart-1)" },
  { name: "OTC", value: 24, color: "var(--chart-2)" },
  { name: "Vitamins", value: 16, color: "var(--chart-3)" },
  { name: "Personal Care", value: 11, color: "var(--chart-4)" },
  { name: "Devices", value: 7, color: "var(--chart-5)" },
];

const weekly = [
  { day: "Mon", sales: 5200 }, { day: "Tue", sales: 6100 }, { day: "Wed", sales: 4800 },
  { day: "Thu", sales: 7300 }, { day: "Fri", sales: 8100 }, { day: "Sat", sales: 9400 }, { day: "Sun", sales: 6900 },
];

const products = [
  ["Amoxicillin 500mg", "Prescription", 412, 2884, "2027-03-14"],
  ["Paracetamol 500mg", "OTC", 980, 1960, "2028-01-22"],
  ["Vitamin D3 1000IU", "Vitamins", 356, 2492, "2027-09-05"],
  ["Ibuprofen 400mg", "OTC", 621, 1863, "2027-06-30"],
  ["Metformin 850mg", "Prescription", 288, 2016, "2027-11-18"],
  ["Cetirizine 10mg", "OTC", 474, 1185, "2028-04-02"],
  ["Omega-3 Fish Oil", "Vitamins", 203, 2233, "2026-12-20"],
  ["Digital Thermometer", "Devices", 94, 1410, "—"],
  ["Hand Sanitizer 250ml", "Personal Care", 530, 1325, "2027-08-11"],
  ["Atorvastatin 20mg", "Prescription", 196, 1764, "2027-02-27"],
] as const;

const card = "rounded-[20px] border border-border bg-card shadow-card";
const control = "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted transition-colors";

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar px-4 py-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Cross className="h-4 w-4" /></div>
          <span className="text-base font-bold">MediCare</span>
        </div>
        {onClose && <button onClick={onClose} aria-label="Close menu"><X className="h-5 w-5" /></button>}
      </div>
      {nav.map((g) => (
        <div key={g.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
          <ul className="space-y-1">
            {g.items.map(([name, Icon]) => {
              const active = name === "Dashboard";
              return (
                <li key={name}>
                  <a href="#" className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-card"}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.75} />{name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("qty");
  const [page, setPage] = useState(0);
  const per = 5;

  const rows = useMemo(() => {
    const r = products.filter((p) => p[0].toLowerCase().includes(q.toLowerCase()) && (cat === "All" || p[1] === cat));
    return [...r].sort((a, b) => (sort === "qty" ? b[2] - a[2] : b[3] - a[3]));
  }, [q, cat, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / per));
  const shown = rows.slice(page * per, page * per + per);

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      <aside className="sticky top-0 hidden h-screen w-[208px] shrink-0 border-r border-border lg:block"><Sidebar /></aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[230px]"><Sidebar onClose={() => setOpen(false)} /></div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 md:max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search medicines, orders…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </label>
          <div className="ml-auto flex items-center gap-3">
            <button className={`${control} hidden sm:inline-flex`}><Globe className="h-4 w-4" />EN<ChevronDown className="h-3 w-3" /></button>
            <button className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-bold">SA</div>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold">Sara Ahmed</p>
                <p className="text-[11px] text-muted-foreground">Pharmacist</p>
              </div>
              <ChevronDown className="hidden h-3 w-3 md:block" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
              <Download className="h-4 w-4" /><span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </header>

        <main className="space-y-5 px-4 pb-8 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Sales Overview</h1>
              <p className="text-xs text-muted-foreground">Here's how your pharmacy is performing this month.</p>
            </div>
            <select className={control} defaultValue="30">
              <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
            </select>
          </div>

          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {metrics.map((m) => {
              const up = m.change >= 0;
              return (
                <div key={m.title} className={`${card} p-5`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{m.title}</p>
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-muted"><m.icon className="h-4 w-4" strokeWidth={1.75} /></div>
                  </div>
                  <p className="mt-3 text-2xl font-bold md:text-[28px]">{m.value}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${up ? "bg-success" : "bg-critical"}`}>
                      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{Math.abs(m.change)}%
                    </span>
                    <span className="text-muted-foreground">{m.note}</span>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="grid gap-4 xl:grid-cols-5">
            <div className={`${card} p-5 xl:col-span-2`}>
              <h2 className="text-[15px] font-semibold">Revenue by Category</h2>
              <div className="relative h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categories} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3} cornerRadius={6} stroke="none">
                      {categories.map((c) => <Cell key={c.name} fill={c.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                  <div><p className="text-xl font-bold">$48.3k</p><p className="text-[11px] text-muted-foreground">Total revenue</p></div>
                </div>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {categories.map((c) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-muted-foreground">{c.name}</span><span className="ml-auto font-semibold">{c.value}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${card} p-5 xl:col-span-3`}>
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold">Weekly Sales Performance</h2>
                <select className={control} defaultValue="this"><option value="this">This week</option><option value="last">Last week</option></select>
              </div>
              <div className="mt-4 h-72">
                <ResponsiveContainer>
                  <BarChart data={weekly} margin={{ left: -10 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip cursor={{ fill: "var(--muted)" }} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Sales"]} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
                    <Bar dataKey="sales" radius={[10, 10, 10, 10]} maxBarSize={38}>
                      {weekly.map((d) => <Cell key={d.day} fill={d.sales >= 8000 ? "var(--chart-1)" : "var(--chart-2)"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className={`${card} p-5`}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="mr-auto text-[15px] font-semibold">Top-Selling Products</h2>
              <label className={control}>
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search" className="w-28 bg-transparent outline-none" />
              </label>
              <label className={control}><SlidersHorizontal className="h-3.5 w-3.5" />
                <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(0); }} className="bg-transparent outline-none">
                  {["All", ...categories.map((c) => c.name)].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className={control}><ArrowUpDown className="h-3.5 w-3.5" />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none">
                  <option value="qty">Quantity</option><option value="price">Total price</option>
                </select>
              </label>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-[13px]">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="w-8 py-3"><input type="checkbox" className="accent-primary" /></th>
                    <th className="py-3 font-medium">Product</th><th className="py-3 font-medium">Category</th>
                    <th className="py-3 text-right font-medium">Quantity Sold</th><th className="py-3 text-right font-medium">Total Price</th>
                    <th className="py-3 pl-6 font-medium">Expiry Date</th><th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((p) => (
                    <tr key={p[0]} className="border-b border-border last:border-0 hover:bg-muted/60">
                      <td className="py-3.5"><input type="checkbox" className="accent-primary" /></td>
                      <td className="py-3.5 font-semibold">{p[0]}</td>
                      <td className="py-3.5"><span className="rounded-full bg-muted px-2.5 py-1 text-xs">{p[1]}</span></td>
                      <td className="py-3.5 text-right tabular-nums">{p[2].toLocaleString()}</td>
                      <td className="py-3.5 text-right font-semibold tabular-nums">${p[3].toLocaleString()}</td>
                      <td className="py-3.5 pl-6 tabular-nums text-muted-foreground">{p[4]}</td>
                      <td><button aria-label="Actions" className="rounded-lg p-1 hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                  {!shown.length && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No products found</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {shown.length} of {rows.length}</span>
              <div className="flex items-center gap-2">
                <button className={control} disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous"><ChevronLeft className="h-3.5 w-3.5" /></button>
                <span>{page + 1} / {pages}</span>
                <button className={control} disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next"><ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
