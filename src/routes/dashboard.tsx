import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Card, Pill, Stat, Table, btn } from "@/components/AppShell";
import { fmtDate, isSameDay, revenueOf, topItems, vnd } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Bảng điều khiển – HIVER" }, { name: "description", content: "Tổng quan hoạt động quán." }, { property: "og:title", content: "Bảng điều khiển – HIVER" }, { property: "og:description", content: "Tổng quan hoạt động quán." }] }),
  component: Dashboard,
});

export const statusTone = (s: string) => (s === "Hoàn thành" ? "ok" : s === "Đã hủy" ? "bad" : "warn") as "ok" | "bad" | "warn";

function Dashboard() {
  return <AppShell title="Bảng điều khiển" actions={<Link to="/ban-hang" className={btn.accent}>+ Tạo đơn mới</Link>}><Body /></AppShell>;
}

function Body() {
  const { orders, stock, staff } = useStore();
  const today = orders.filter((o) => isSameDay(new Date(o.createdAt), new Date()));
  const pending = orders.filter((o) => o.status === "Đang pha");
  const low = stock.filter((s) => s.qty < s.min);
  const hour = new Date().getHours();
  const shift = hour < 12 ? "Sáng" : hour < 18 ? "Chiều" : "Tối";
  const top = topItems(today.length ? today : orders).slice(0, 5);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Doanh thu hôm nay" value={vnd(revenueOf(today))} hint="Đơn đã thanh toán" />
        <Stat label="Đơn hôm nay" value={today.filter((o) => o.status !== "Đã hủy").length} hint={`${pending.length} đơn đang pha`} />
        <Stat label="Nguyên liệu sắp hết" value={low.length} hint={<Link to="/kho" className="underline">Xem kho</Link>} />
        <Stat label={`Nhân viên ca ${shift}`} value={staff.filter((s) => s.shift === shift).length} hint={`Tổng ${staff.length} nhân viên`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-2 flex items-center"><h2 className="font-semibold">Đơn hàng gần đây</h2><Link to="/don-hang" className={`${btn.link} ml-auto`}>Xem tất cả →</Link></div>
          <Table head={["Mã đơn", "Khách hàng", "Thời gian", "Tổng tiền", "Trạng thái"]}
            rows={orders.slice(0, 6).map((o) => [o.id, o.customer, fmtDate(o.createdAt), vnd(o.total), <Pill tone={statusTone(o.status)}>{o.status}</Pill>])} />
        </div>
        <div className="space-y-4">
          <Card>
            <h2 className="mb-2 font-semibold">Bán chạy {today.length ? "hôm nay" : ""}</h2>
            {top.length === 0 && <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>}
            {top.map((t, i) => <div key={t.name} className="flex justify-between py-1 text-sm"><span>{i + 1}. {t.name}</span><b>{t.qty}</b></div>)}
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold">Cảnh báo kho</h2>
            {low.length === 0 ? <p className="text-sm text-muted-foreground">Kho đủ hàng.</p> :
              low.map((s) => <div key={s.id} className="flex justify-between py-1 text-sm"><span>{s.name}</span><span className="text-destructive">{+s.qty.toFixed(2)} / {s.min} {s.unit}</span></div>)}
          </Card>
        </div>
      </div>
    </>
  );
}
