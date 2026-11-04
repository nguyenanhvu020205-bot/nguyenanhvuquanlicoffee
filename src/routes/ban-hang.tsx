import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell, Card, btn, inputCls } from "@/components/AppShell";
import { AiPanel } from "@/components/AiPanel";
import { CATS, consumption, vnd, type MenuItem, type Order } from "@/lib/data";
import { useStore } from "@/lib/store";
import { goiYMonAI } from "@/lib/ai/features.functions";

export const Route = createFileRoute("/ban-hang")({
  head: () => ({ meta: [{ title: "Bán hàng – HIVER" }, { name: "description", content: "Màn hình bán hàng tại quầy." }, { property: "og:title", content: "Bán hàng – HIVER" }, { property: "og:description", content: "Màn hình bán hàng tại quầy." }] }),
  component: () => <AppShell title="Bán hàng"><Pos /></AppShell>,
});

type Size = "M" | "L";
type CartLine = { item: MenuItem; size: Size; qty: number };
const priceOf = (m: MenuItem, size: Size) => (size === "L" ? (m.priceL ?? m.price) : m.price);

function Pos() {
  const { menu, stock, staff, createOrder } = useStore();
  // Giỏ hàng theo cặp món + size: khóa "menuId:size"
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("Tất cả");
  const [q, setQ] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [staffId, setStaffId] = useState("");
  const [cash, setCash] = useState("");
  const [last, setLast] = useState<Order | null>(null);
  const run = useServerFn(goiYMonAI);

  const lines: CartLine[] = Object.entries(cart).filter(([, qty]) => qty > 0).flatMap(([key, qty]) => {
    const [id, size] = key.split(":");
    const item = menu.find((m) => m.id === Number(id));
    return item ? [{ item, size: (size === "L" ? "L" : "M") as Size, qty }] : [];
  });
  const total = lines.reduce((s, l) => s + priceOf(l.item, l.size) * l.qty, 0);
  const add = (id: number, size: Size, d: number) =>
    setCart((c) => ({ ...c, [`${id}:${size}`]: Math.max(0, (c[`${id}:${size}`] || 0) + d) }));
  const shown = menu.filter((m) => (cat === "Tất cả" || m.cat === cat) && m.name.toLowerCase().includes(q.toLowerCase()));

  const shortage = useMemo(() => {
    const need = consumption(menu, lines.map((l) => ({ menuId: l.item.id, qty: l.qty })));
    return stock.filter((s) => (need[s.id] ?? 0) > s.qty).map((s) => s.name);
  }, [menu, stock, cart]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkout = (paid: boolean) => {
    if (!total) return;
    const o = createOrder({
      customer, phone, paid, staffId: staffId || undefined,
      lines: lines.map((l) => ({ menuId: l.item.id, qty: l.qty, price: priceOf(l.item, l.size), label: l.item.priceL ? `Size ${l.size}` : undefined })),
    });
    if (!o) return;
    setLast(o);
    setCart({}); setCustomer(""); setPhone(""); setCash("");
    toast.success(`Đã tạo đơn ${o.id} – ${vnd(o.total)}${paid ? " (đã thanh toán)" : ""}`);
  };
  const change = Number(cash) - total;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {["Tất cả", ...CATS.filter((c) => menu.some((m) => m.cat === c))].map((c) => (
              <button key={c} onClick={() => setCat(c)} className={c === cat ? btn.primary : btn.ghost}>{c}</button>
            ))}
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm món…" className={`${inputCls} ml-auto max-w-56`} />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {shown.map((m) => (
              <div key={m.id} className="group relative rounded-xl border bg-card p-3 text-left shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                {m.image
                  ? <div className="mb-2 aspect-square w-full overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                      <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    </div>
                  : <div className="mb-2 flex aspect-square w-full items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">Chưa có ảnh</div>}
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.cat}</div>
                <div className="mt-2 flex gap-1">
                  {(["M", ...(m.priceL ? ["L"] : [])] as Size[]).map((s) => {
                    const qty = cart[`${m.id}:${s}`] ?? 0;
                    return (
                      <button key={s} onClick={() => add(m.id, s, 1)}
                        className={`relative flex-1 rounded-md border px-2 py-1.5 text-sm font-medium hover:border-accent ${qty > 0 ? "border-accent bg-accent/10" : ""}`}>
                        {s} · {vnd(priceOf(m, s))}
                        {qty > 0 && <span className="absolute -right-1.5 -top-1.5 rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground">{qty}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {shown.length === 0 && <p className="text-sm text-muted-foreground">Không tìm thấy món. <Link to="/menu" className="underline">Thêm món</Link></p>}
          </div>
        </div>
        <Card className="h-fit lg:sticky lg:top-4">
          <h2 className="mb-3 font-semibold">Hóa đơn</h2>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Tên khách (tùy chọn)" className={inputCls} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="SĐT" className={inputCls} />
            <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className={`${inputCls} col-span-2`}>
              <option value="">— Nhân viên phục vụ —</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
            </select>
          </div>
          {lines.length === 0 && <p className="text-sm text-muted-foreground">Chưa có món nào. Bấm vào size M/L của món để thêm.</p>}
          {lines.map((l) => (
            <div key={`${l.item.id}:${l.size}`} className="flex items-center justify-between gap-2 border-b py-2 text-sm">
              <span className="flex-1">{l.item.name}{l.item.priceL ? ` (${l.size})` : ""}
                <div className="text-xs text-muted-foreground">{vnd(priceOf(l.item, l.size))}</div>
              </span>
              <span className="flex items-center gap-2">
                <button onClick={() => add(l.item.id, l.size, -1)} className="h-6 w-6 rounded bg-secondary">−</button>
                {l.qty}
                <button onClick={() => add(l.item.id, l.size, 1)} className="h-6 w-6 rounded bg-secondary">+</button>
              </span>
              <span className="w-20 text-right font-medium">{vnd(priceOf(l.item, l.size) * l.qty)}</span>
            </div>
          ))}
          {shortage.length > 0 && <p className="mt-2 text-xs text-destructive">⚠ Kho không đủ: {shortage.join(", ")}</p>}
          <div className="mt-4 flex justify-between text-lg font-bold"><span>Tổng</span><span>{vnd(total)}</span></div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="w-24">Khách đưa</span>
            <input type="number" value={cash} onChange={(e) => setCash(e.target.value)} className={inputCls} placeholder="0" />
          </div>
          {cash && total > 0 && <div className={`mt-1 text-right text-sm ${change < 0 ? "text-destructive" : "text-primary"}`}>{change < 0 ? "Thiếu " + vnd(-change) : "Tiền thối: " + vnd(change)}</div>}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button disabled={!total} onClick={() => checkout(false)} className={btn.ghost}>Lưu đơn (chưa TT)</button>
            <button disabled={!total || (cash !== "" && change < 0)} onClick={() => checkout(true)} className={btn.primary}>THANH TOÁN</button>
          </div>
          {lines.length > 0 && <button onClick={() => setCart({})} className={`${btn.linkDanger} mt-2`}>Xóa giỏ</button>}
          {last && (
            <div className="mt-4 rounded border border-dashed p-3 text-sm">
              Đơn vừa tạo: <b>{last.id}</b> – {vnd(last.total)}{" "}
              <Link to="/don-hang" className="underline">Xem đơn hàng</Link>
            </div>
          )}
        </Card>
      </div>
      <div className="mt-6">
        <AiPanel
          title="AI gợi ý món cho khách"
          cta="Gợi ý món"
          placeholder="Mô tả khách muốn gì, ví dụ: “muốn đồ uống ít ngọt, hơi chua, có cà phê”"
          run={run}
        />
      </div>
    </>
  );
}
