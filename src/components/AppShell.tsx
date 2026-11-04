import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
const logo = { url: "/hiver-logo.png" };
import { Home, ShoppingCart, ClipboardList, Coffee, Package, Users, BarChart3, Sparkles, LogOut, Sun, UserCircle2 } from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Trang chủ", icon: Home },
  { to: "/ban-hang", label: "Bán hàng", icon: ShoppingCart },
  { to: "/don-hang", label: "Đơn hàng", icon: ClipboardList },
  { to: "/menu", label: "Menu", icon: Coffee },
  { to: "/kho", label: "Kho", icon: Package },
  { to: "/nhan-vien", label: "Nhân viên", icon: Users },
  { to: "/thong-ke", label: "Thống kê", icon: BarChart3 },
  { to: "/tro-ly", label: "Trợ lý AI", icon: Sparkles },
] as const;

/** Nạp dữ liệu đã lưu trên trình duyệt (chỉ chạy phía client). */
export function useStoreReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const p = useStore.persist;
    if (!p || p.hasHydrated()) { setReady(true); return; }
    const unsub = p.onFinishHydration(() => setReady(true));
    void p.rehydrate();
    return unsub;
  }, []);
  return ready;
}

export function AppShell({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const ready = useStoreReady();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  const hour = now?.getHours() ?? 8;
  const shift = hour < 14 ? "Sáng · 07:00–14:00" : hour < 22 ? "Chiều · 14:00–22:00" : "Đêm";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="print:hidden">
        <div className="bg-header flex flex-wrap items-center gap-4 border-b px-6 py-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={logo.url} alt="Logo HIVER Coffee" className="h-12 w-12 rounded-full shadow-card" />
            <span className="leading-tight">
              <span className="block font-display text-2xl font-extrabold tracking-wider text-primary">HIVER</span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Good coffee · Good day</span>
            </span>
          </Link>
          <p className="hidden font-display text-lg italic text-primary/80 lg:block">Chào mừng {user ?? "bạn"} quay trở lại!</p>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-card/80 px-3 py-1.5 shadow-card">
              <Sun className="h-5 w-5 text-accent" />
              <div className="text-xs leading-tight"><div className="text-muted-foreground">Ca làm việc</div><div className="font-semibold text-primary">{shift}</div></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card/80 px-3 py-1.5 shadow-card">
              <UserCircle2 className="h-5 w-5 text-primary" />
              <div className="text-xs leading-tight"><div className="text-muted-foreground">Nhân viên</div><div className="font-semibold text-primary">{user ?? "—"}</div></div>
            </div>
          </div>
        </div>
        <nav className="bg-nav flex flex-wrap items-stretch px-4 text-primary-foreground shadow-card">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-wide opacity-85 transition hover:bg-primary-foreground/10 hover:opacity-100"
              activeProps={{ className: "!border-accent bg-primary-foreground/15 !opacity-100" }}>
              <n.icon className="h-4 w-4" />{n.label}
            </Link>
          ))}
          <button onClick={() => { logout(); navigate({ to: "/" }); }}
            className="ml-auto flex items-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-wide opacity-85 hover:bg-primary-foreground/10 hover:opacity-100">
            <LogOut className="h-4 w-4" />Đăng xuất
          </button>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b pb-3">
          <h1 className="font-display text-3xl font-bold text-primary">{title}</h1>
          <div className="ml-auto flex flex-wrap gap-2 print:hidden">{actions}</div>
        </div>
        {ready && user ? children : <p className="text-sm text-muted-foreground">Đang tải dữ liệu…</p>}
      </main>
      <footer className="flex flex-wrap items-center gap-6 border-t bg-card px-6 py-2 text-xs text-muted-foreground print:hidden">
        <span>Ngày: {now?.toLocaleDateString("vi-VN") ?? ""}</span>
        <span>Giờ: {now?.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) ?? ""}</span>
        <span className="mx-auto font-display italic text-primary">♥ Hiver Coffee · Thank you, see you again!</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />Đang hoạt động</span>
      </footer>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-card p-5 shadow-card ${className}`}>{children}</div>;
}

export function Table({ head, rows, empty = "Không có dữ liệu." }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-primary text-primary-foreground">
          <tr>{head.map((h, i) => <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={head.length} className="px-3 py-6 text-center text-muted-foreground">{empty}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={i} className="border-t transition even:bg-muted/40 hover:bg-secondary/60">
              {r.map((c, j) => <td key={j} className="px-3 py-2 align-middle">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnBase = "inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition active:scale-[0.98] disabled:opacity-50";
export const btn = {
  primary: `${btnBase} bg-primary text-primary-foreground hover:opacity-90`,
  accent: `${btnBase} bg-accent text-accent-foreground hover:opacity-90`,
  ghost: `${btnBase} bg-secondary text-secondary-foreground hover:opacity-80`,
  danger: `${btnBase} bg-destructive text-destructive-foreground hover:opacity-90`,
  link: "text-sm font-medium text-primary hover:underline",
  linkDanger: "text-sm font-medium text-destructive hover:underline",
};
export const inputCls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <Card>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold text-primary">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

export function Pill({ tone, children }: { tone: "ok" | "warn" | "bad" | "muted"; children: ReactNode }) {
  const t = { ok: "bg-secondary text-primary", warn: "bg-accent text-accent-foreground", bad: "bg-destructive/15 text-destructive", muted: "bg-muted text-muted-foreground" }[tone];
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${t}`}>{children}</span>;
}
