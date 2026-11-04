import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, Card, Stat, Table, btn } from "@/components/AppShell";
import { AiPanel } from "@/components/AiPanel";
import { fmtDate, last7Days, revenueOf, topItems, vnd } from "@/lib/data";
import { useStore } from "@/lib/store";
import { taoBaoCaoAI } from "@/lib/ai/features.functions";

export const Route = createFileRoute("/thong-ke")({
  head: () => ({ meta: [{ title: "Thống kê – HIVER" }, { name: "description", content: "Báo cáo doanh thu theo tuần." }, { property: "og:title", content: "Thống kê – HIVER" }, { property: "og:description", content: "Báo cáo doanh thu theo tuần." }] }),
  component: () => <AppShell title="Thống kê doanh thu"><ThongKe /></AppShell>,
});

function exportCsv(rows: (string | number)[][], name: string) {
  const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function ThongKe() {
  const orders = useStore((s) => s.orders);
  const run = useServerFn(taoBaoCaoAI);
  const week = last7Days(orders);
  const max = Math.max(1, ...week.map((w) => w.v));
  const total = week.reduce((s, w) => s + w.v, 0);
  const cnt = week.reduce((s, w) => s + w.count, 0);
  const top = topItems(orders);
  const unpaid = orders.filter((o) => !o.paid && o.status !== "Đã hủy");

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Doanh thu 7 ngày" value={vnd(total)} />
        <Stat label="Số đơn 7 ngày" value={cnt} />
        <Stat label="Giá trị TB / đơn" value={vnd(cnt ? total / cnt : 0)} />
        <Stat label="Chưa thu tiền" value={vnd(unpaid.reduce((s, o) => s + o.total, 0))} hint={`${unpaid.length} đơn`} />
      </div>
      <Card>
        <div className="mb-4 flex flex-wrap justify-between gap-2">
          <h2 className="font-semibold">Doanh thu 7 ngày gần nhất</h2>
          <div className="flex gap-2 print:hidden">
            <button className={btn.primary} onClick={() => exportCsv([
              ["Mã đơn", "Khách hàng", "SĐT", "Thời gian", "Món", "Tổng tiền", "Trạng thái", "Thanh toán"],
              ...orders.map((o) => [o.id, o.customer, o.phone, fmtDate(o.createdAt), o.items.map((i) => `${i.qty}x ${i.name}`).join("; "), o.total, o.status, o.paid ? "Đã TT" : "Chưa"]),
            ], "hiver-don-hang.csv")}>Xuất Excel</button>
            <button onClick={() => window.print()} className={btn.ghost}>In báo cáo</button>
          </div>
        </div>
        <div className="flex h-64 items-end gap-4">
          {week.map((w) => (
            <div key={w.date} className="flex flex-1 flex-col items-center gap-1" title={`${w.date}: ${vnd(w.v)}`}>
              <span className="text-xs">{(w.v / 1000).toFixed(0)}k</span>
              <div className="w-full rounded-t bg-accent" style={{ height: `${(w.v / max) * 200}px` }} />
              <span className="text-sm text-muted-foreground">{w.d}</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold">Món bán chạy</h2>
          <Table head={["#", "Món", "Số lượng", "Doanh thu"]} rows={top.slice(0, 10).map((t, i) => [i + 1, t.name, t.qty, vnd(t.revenue)])} />
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Theo ngày</h2>
          <Table head={["Ngày", "Số đơn", "Doanh thu"]} rows={[...week].reverse().map((w) => [`${w.d} ${w.date}`, w.count, vnd(w.v)])} />
          <p className="mt-2 text-xs text-muted-foreground">Tổng doanh thu toàn bộ: {vnd(revenueOf(orders))}</p>
        </div>
      </div>
      <div className="mt-6 print:hidden">
        <AiPanel title="Báo cáo AI" cta="Tạo báo cáo AI" run={run} />
      </div>
    </>
  );
}
