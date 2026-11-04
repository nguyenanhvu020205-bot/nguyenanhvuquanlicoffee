import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Pill, Table, btn, inputCls } from "@/components/AppShell";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { STATUSES, fmtDate, vnd, type Order, type OrderStatus } from "@/lib/data";
import { useStore } from "@/lib/store";
import { statusTone } from "./dashboard";

export const Route = createFileRoute("/don-hang")({
  head: () => ({ meta: [{ title: "Đơn hàng – HIVER" }, { name: "description", content: "Danh sách đơn hàng." }, { property: "og:title", content: "Đơn hàng – HIVER" }, { property: "og:description", content: "Danh sách đơn hàng." }] }),
  component: () => <AppShell title="Danh sách đơn hàng"><Orders /></AppShell>,
});

function Orders() {
  const { orders, staff, setStatus, setPaid, removeOrder } = useStore();
  const [st, setSt] = useState("Tất cả");
  const [pay, setPay] = useState("Tất cả");
  const [q, setQ] = useState("");
  const [view, setView] = useState<Order | null>(null);
  const list = orders.filter((o) =>
    (st === "Tất cả" || o.status === st) &&
    (pay === "Tất cả" || (pay === "Đã thanh toán") === o.paid) &&
    (o.id + o.customer + o.phone).toLowerCase().includes(q.toLowerCase()));
  const sum = list.filter((o) => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  const current = view ? orders.find((o) => o.id === view.id) ?? null : null;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã đơn, tên, SĐT…" className={`${inputCls} max-w-64`} />
        <select value={st} onChange={(e) => setSt(e.target.value)} className="rounded border bg-card px-3 py-2 text-sm">
          {["Tất cả", ...STATUSES].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={pay} onChange={(e) => setPay(e.target.value)} className="rounded border bg-card px-3 py-2 text-sm">
          {["Tất cả", "Đã thanh toán", "Chưa thanh toán"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="ml-auto text-sm text-muted-foreground">{list.length} đơn · {vnd(sum)}</span>
      </div>
      <Table head={["Mã đơn", "Khách hàng", "SĐT", "Thời gian", "Tổng tiền", "Trạng thái", "Thanh toán", ""]}
        rows={list.map((o) => [
          <b>{o.id}</b>, o.customer, o.phone || "—", fmtDate(o.createdAt), vnd(o.total),
          <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="rounded border bg-background px-2 py-1 text-xs">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>,
          <button onClick={() => setPaid(o.id, !o.paid)} title="Bấm để đổi">
            <Pill tone={o.paid ? "ok" : "warn"}>{o.paid ? "Đã thanh toán" : "Chưa"}</Pill>
          </button>,
          <button className={btn.link} onClick={() => setView(o)}>Chi tiết</button>,
        ])} />

      <Dialog open={!!current} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent>
          {current && (
            <>
              <DialogHeader><DialogTitle>Đơn {current.id}</DialogTitle></DialogHeader>
              <div className="space-y-1 text-sm">
                <div>Khách: <b>{current.customer}</b> {current.phone && `· ${current.phone}`}</div>
                <div>Thời gian: {fmtDate(current.createdAt)}</div>
                {current.staffId && <div>Nhân viên: {staff.find((s) => s.id === current.staffId)?.name ?? current.staffId}</div>}
                <div>Trạng thái: <Pill tone={statusTone(current.status)}>{current.status}</Pill> · {current.paid ? "Đã thanh toán" : "Chưa thanh toán"}</div>
              </div>
              <div className="my-2 border-y py-2 text-sm">
                {current.items.map((it) => (
                  <div key={it.menuId} className="flex justify-between py-0.5"><span>{it.qty} × {it.name}</span><span>{vnd(it.qty * it.price)}</span></div>
                ))}
                <div className="mt-1 flex justify-between font-bold"><span>Tổng</span><span>{vnd(current.total)}</span></div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {current.status === "Đang pha" && <button className={btn.primary} onClick={() => setStatus(current.id, "Hoàn thành")}>Hoàn thành</button>}
                {!current.paid && current.status !== "Đã hủy" && <button className={btn.accent} onClick={() => setPaid(current.id, true)}>Thu tiền</button>}
                {current.status !== "Đã hủy" && <button className={btn.ghost} onClick={() => setStatus(current.id, "Đã hủy")}>Hủy đơn</button>}
                <button className={btn.danger} onClick={() => { if (confirm("Xóa vĩnh viễn đơn này?")) { removeOrder(current.id); setView(null); } }}>Xóa</button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
