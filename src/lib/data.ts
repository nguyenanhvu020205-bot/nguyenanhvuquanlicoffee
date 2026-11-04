export const vnd = (n: number) => Math.round(n).toLocaleString("vi-VN") + " đ";

export type MenuItem = { id: number; name: string; cat: string; price: number; priceL?: number | undefined; image?: string | undefined; recipe: Record<string, number> };
export type Staff = { id: string; name: string; role: string; phone: string; shift: string };
export type StockItem = { id: string; name: string; unit: string; qty: number; min: number };
export type OrderStatus = "Đang pha" | "Hoàn thành" | "Đã hủy";
export type OrderLine = { menuId: number; name: string; price: number; qty: number };
export type Order = {
  id: string;
  customer: string;
  phone: string;
  createdAt: string; // ISO
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  paid: boolean;
  staffId?: string | undefined;
};

export const CATS = ["Cà phê truyền thống", "Cà phê hiện đại", "Cacao/ Matcha", "Trà trái cây", "Sữa chua", "Nước ép", "Khác"] as [string, ...string[]];
export const ROLES = ["Quản lý", "Thu ngân", "Pha chế", "Phục vụ"] as [string, string, ...string[]];
export const SHIFTS = ["Sáng", "Chiều", "Tối"] as [string, ...string[]];
export const STATUSES: OrderStatus[] = ["Đang pha", "Hoàn thành", "Đã hủy"];

// recipe: lượng nguyên liệu (theo đơn vị kho) tiêu hao cho 1 phần
export const seedStock: StockItem[] = [
  { id: "K01", name: "Cà phê rang xay", unit: "kg", qty: 12, min: 5 },
  { id: "K02", name: "Cà phê hạt pha Espresso", unit: "kg", qty: 6, min: 3 },
  { id: "K03", name: "Sữa đặc", unit: "lon", qty: 48, min: 20 },
  { id: "K04", name: "Sữa tươi không đường", unit: "lít", qty: 15, min: 10 },
  { id: "K05", name: "Bột matcha", unit: "kg", qty: 2, min: 1 },
  { id: "K06", name: "Đường cát", unit: "kg", qty: 20, min: 5 },
  { id: "K07", name: "Trà đen", unit: "kg", qty: 3, min: 1 },
  { id: "K08", name: "Bột cacao", unit: "kg", qty: 3, min: 1 },
  { id: "K09", name: "Cascara (vỏ quả cà phê khô)", unit: "kg", qty: 1, min: 0.5 },
  { id: "K10", name: "Sữa chua", unit: "hũ", qty: 40, min: 15 },
  { id: "K11", name: "Kem béo (whipping cream)", unit: "lít", qty: 5, min: 2 },
  { id: "K12", name: "Kem phô mai", unit: "kg", qty: 2, min: 1 },
  { id: "K13", name: "Nước cốt dừa", unit: "lít", qty: 4, min: 2 },
  { id: "K14", name: "Trà nhài", unit: "kg", qty: 2, min: 1 },
  { id: "K15", name: "Trà nền pha chế", unit: "kg", qty: 3, min: 1 },
  { id: "K16", name: "Cam tươi", unit: "kg", qty: 10, min: 4 },
  { id: "K17", name: "Chanh tươi", unit: "kg", qty: 4, min: 2 },
  { id: "K18", name: "Chanh dây", unit: "kg", qty: 4, min: 2 },
  { id: "K19", name: "Dứa (thơm)", unit: "quả", qty: 10, min: 4 },
  { id: "K20", name: "Đào ngâm", unit: "hộp", qty: 8, min: 3 },
  { id: "K21", name: "Vải ngâm", unit: "hộp", qty: 8, min: 3 },
  { id: "K22", name: "Ổi hồng", unit: "kg", qty: 4, min: 2 },
  { id: "K23", name: "Dưa lưới", unit: "quả", qty: 5, min: 2 },
  { id: "K24", name: "Việt quất", unit: "kg", qty: 1, min: 0.5 },
  { id: "K25", name: "Phúc bồn tử", unit: "kg", qty: 1, min: 0.5 },
  { id: "K26", name: "Trái cây nhiệt đới", unit: "kg", qty: 3, min: 1 },
  { id: "K27", name: "Syrup đường", unit: "chai", qty: 6, min: 2 },
  { id: "K28", name: "Syrup đào", unit: "chai", qty: 4, min: 2 },
  { id: "K29", name: "Syrup vải", unit: "chai", qty: 4, min: 2 },
  { id: "K30", name: "Syrup caramel", unit: "chai", qty: 4, min: 2 },
  { id: "K31", name: "Syrup bạc hà", unit: "chai", qty: 3, min: 1 },
  { id: "K32", name: "Syrup ổi hồng", unit: "chai", qty: 3, min: 1 },
  { id: "K33", name: "Syrup nhiệt đới", unit: "chai", qty: 3, min: 1 },
  { id: "K34", name: "Syrup phúc bồn tử", unit: "chai", qty: 3, min: 1 },
  { id: "K35", name: "Syrup dưa lưới", unit: "chai", qty: 3, min: 1 },
  { id: "K36", name: "Mứt việt quất", unit: "hũ", qty: 3, min: 1 },
  { id: "K37", name: "Bơ đậu phộng", unit: "hũ", qty: 3, min: 1 },
  { id: "K38", name: "Bột rau câu", unit: "gói", qty: 10, min: 4 },
  { id: "K39", name: "Đá viên", unit: "kg", qty: 50, min: 20 },
  { id: "K40", name: "Nước lọc", unit: "bình", qty: 10, min: 4 },
];

// price = giá Size M; priceL = giá Size L (bỏ trống nếu món chỉ có 1 size)
export const seedMenu: MenuItem[] = [
  // Cà phê truyền thống
  { id: 1, name: "Cafe Đen", cat: "Cà phê truyền thống", price: 26000, priceL: 32000, image: "/drinks/drink_01_Cafe_Den.jpg", recipe: { K01: 0.025, K06: 0.015, K39: 0.15 } },
  { id: 2, name: "Cafe Sữa", cat: "Cà phê truyền thống", price: 30000, priceL: 37000, image: "/drinks/drink_02_Cafe_Sua.jpg", recipe: { K01: 0.025, K03: 0.1, K39: 0.15 } },
  { id: 3, name: "Bạc Xỉu", cat: "Cà phê truyền thống", price: 30000, priceL: 37000, image: "/drinks/drink_03_Bac_Xiu.jpg", recipe: { K01: 0.015, K03: 0.12, K04: 0.1, K39: 0.15 } },
  { id: 4, name: "Cafe Sữa Tươi", cat: "Cà phê truyền thống", price: 32000, priceL: 39000, image: "/drinks/drink_04_Cafe_Sua_Tuoi.jpg", recipe: { K01: 0.025, K04: 0.15, K39: 0.15 } },
  { id: 5, name: "Cà Phê Bơ Đậu", cat: "Cà phê truyền thống", price: 39000, priceL: 49000, image: "/drinks/drink_05_Ca_Phe_Bo_Dau.jpg", recipe: { K01: 0.025, K03: 0.08, K37: 0.03, K11: 0.03, K39: 0.15 } },
  // Cà phê hiện đại
  { id: 6, name: "Cold Brew Đá", cat: "Cà phê hiện đại", price: 35000, priceL: 42000, image: "/drinks/drink_06_Cold_Brew_Da.jpg", recipe: { K02: 0.02, K40: 0.05, K39: 0.2 } },
  { id: 7, name: "Cold Brew Cam", cat: "Cà phê hiện đại", price: 37000, priceL: 47000, image: "/drinks/drink_07_Cold_Brew_Cam.jpg", recipe: { K02: 0.02, K16: 0.15, K27: 0.015, K40: 0.05, K39: 0.2 } },
  { id: 8, name: "Cold Brew Đào Nhài", cat: "Cà phê hiện đại", price: 37000, priceL: 47000, image: "/drinks/drink_08_Cold_Brew_Dao_Nhai.jpg", recipe: { K02: 0.02, K20: 0.05, K14: 0.003, K40: 0.05, K39: 0.2 } },
  { id: 9, name: "Cold Brew Nhiệt Đới", cat: "Cà phê hiện đại", price: 39000, priceL: 49000, image: "/drinks/drink_09_Cold_Brew_Nhiet_Doi.jpg", recipe: { K02: 0.02, K26: 0.06, K33: 0.015, K40: 0.05, K39: 0.2 } },
  { id: 10, name: "Latte Coco", cat: "Cà phê hiện đại", price: 37000, priceL: 47000, image: "/drinks/drink_10_Latte_Coco.jpg", recipe: { K02: 0.018, K13: 0.12, K04: 0.08, K39: 0.1 } },
  { id: 11, name: "Latte Caramel", cat: "Cà phê hiện đại", price: 37000, priceL: 47000, image: "/drinks/drink_11_Latte_Caramel.jpg", recipe: { K02: 0.018, K04: 0.2, K30: 0.015, K39: 0.1 } },
  { id: 12, name: "Latte Bạc Hà", cat: "Cà phê hiện đại", price: 37000, priceL: 47000, image: "/drinks/drink_12_Latte_Bac_Ha.jpg", recipe: { K02: 0.018, K04: 0.2, K31: 0.01, K39: 0.1 } },
  { id: 13, name: "Cà Phê Kem Phô Mai", cat: "Cà phê hiện đại", price: 39000, image: "/drinks/drink_13_Ca_Phe_Kem_Pho_Mai.jpg", recipe: { K02: 0.018, K12: 0.03, K04: 0.1, K27: 0.01, K39: 0.1 } },
  // Cacao/ Matcha
  { id: 14, name: "Cacao Nóng/ Đá", cat: "Cacao/ Matcha", price: 35000, priceL: 45000, image: "/drinks/drink_14_Cacao_Nong_Da.jpg", recipe: { K08: 0.025, K04: 0.2, K27: 0.01, K39: 0.1 } },
  { id: 15, name: "Matcha Sữa", cat: "Cacao/ Matcha", price: 35000, priceL: 45000, image: "/drinks/drink_15_Matcha_Sua.jpg", recipe: { K05: 0.008, K04: 0.18, K27: 0.015, K39: 0.1 } },
  { id: 16, name: "Cacao Dừa Mịn", cat: "Cacao/ Matcha", price: 39000, priceL: 49000, image: "/drinks/drink_16_Cacao_Dua_Min.jpg", recipe: { K08: 0.025, K13: 0.1, K04: 0.1, K11: 0.03, K39: 0.15 } },
  { id: 17, name: "Cacao Kem Mịn", cat: "Cacao/ Matcha", price: 39000, priceL: 49000, image: "/drinks/drink_17_Cacao_Kem_Min.jpg", recipe: { K08: 0.025, K04: 0.15, K11: 0.05, K27: 0.01, K39: 0.1 } },
  { id: 18, name: "Matcha Kem Mịn", cat: "Cacao/ Matcha", price: 42000, priceL: 52000, image: "/drinks/drink_18_Matcha_Kem_Min.jpg", recipe: { K05: 0.008, K04: 0.15, K11: 0.05, K27: 0.01, K39: 0.1 } },
  // Trà trái cây
  { id: 19, name: "Trà Đào Cam", cat: "Trà trái cây", price: 42000, priceL: 52000, image: "/drinks/drink_19_Tra_Dao_Cam.jpg", recipe: { K15: 0.008, K20: 0.06, K16: 0.1, K28: 0.02, K39: 0.25 } },
  { id: 20, name: "Trà Đào", cat: "Trà trái cây", price: 42000, priceL: 52000, image: "/drinks/drink_20_Tra_Dao.jpg", recipe: { K15: 0.008, K20: 0.07, K28: 0.02, K39: 0.25 } },
  { id: 21, name: "Trà Vải", cat: "Trà trái cây", price: 42000, priceL: 52000, image: "/drinks/drink_21_Tra_Vai.jpg", recipe: { K15: 0.008, K21: 0.06, K29: 0.02, K39: 0.25 } },
  { id: 22, name: "Trà Nhiệt Đới", cat: "Trà trái cây", price: 42000, priceL: 52000, image: "/drinks/drink_22_Tra_Nhiet_Doi.jpg", recipe: { K15: 0.008, K26: 0.07, K33: 0.02, K39: 0.25 } },
  { id: 23, name: "Trà Ổi Hồng", cat: "Trà trái cây", price: 39000, priceL: 49000, image: "/drinks/drink_23_Tra_Oi_Hong.jpg", recipe: { K15: 0.008, K22: 0.08, K32: 0.02, K39: 0.25 } },
  { id: 24, name: "Trà Cam Ổi", cat: "Trà trái cây", price: 39000, priceL: 49000, image: "/drinks/drink_24_Tra_Cam_Oi.jpg", recipe: { K15: 0.008, K16: 0.08, K22: 0.05, K32: 0.015, K39: 0.25 } },
  { id: 25, name: "Cascara Phúc Bồn Tử", cat: "Trà trái cây", price: 39000, priceL: 49000, image: "/drinks/drink_25_Cascara_Phuc_Bon_Tu.jpg", recipe: { K09: 0.008, K25: 0.05, K34: 0.02, K39: 0.25 } },
  // Sữa chua
  { id: 26, name: "Sữa Chua Truyền Thống", cat: "Sữa chua", price: 37000, image: "/drinks/drink_26_Sua_Chua_Truyen_Thong.jpg", recipe: { K10: 1, K06: 0.02, K39: 0.2 } },
  { id: 27, name: "Sữa Chua Việt Quất", cat: "Sữa chua", price: 39000, image: "/drinks/drink_27_Sua_Chua_Viet_Quat.jpg", recipe: { K10: 1, K36: 0.04, K24: 0.02, K39: 0.2 } },
  { id: 28, name: "Sữa Chua Dưa Lưới", cat: "Sữa chua", price: 39000, image: "/drinks/drink_28_Sua_Chua_Dua_Luoi.jpg", recipe: { K10: 1, K23: 0.04, K35: 0.02, K39: 0.2 } },
  { id: 29, name: "Sữa Chua Nhiệt Đới", cat: "Sữa chua", price: 45000, image: "/drinks/drink_29_Sua_Chua_Nhiet_Doi.jpg", recipe: { K10: 1, K26: 0.06, K33: 0.02, K39: 0.2 } },
  // Nước ép
  { id: 30, name: "Ép Cam", cat: "Nước ép", price: 35000, image: "/drinks/drink_30_Ep_Cam.jpg", recipe: { K16: 0.3, K27: 0.01, K39: 0.2 } },
  { id: 31, name: "Ép Chanh Dây", cat: "Nước ép", price: 35000, image: "/drinks/drink_31_Ep_Chanh_Day.jpg", recipe: { K18: 0.15, K27: 0.02, K39: 0.25 } },
  { id: 32, name: "Ép Cam Thơm", cat: "Nước ép", price: 37000, image: "/drinks/drink_32_Ep_Cam_Thom.jpg", recipe: { K16: 0.2, K19: 0.15, K27: 0.01, K39: 0.2 } },
  { id: 33, name: "Đá Chanh", cat: "Nước ép", price: 32000, image: "/drinks/drink_33_Da_Chanh.jpg", recipe: { K17: 0.08, K06: 0.02, K39: 0.25 } },
  { id: 34, name: "Thạch (Dưa lưới/ Matcha/ Càfê)", cat: "Nước ép", price: 5000, image: "/drinks/drink_34_Thach_Dua_Luoi_Matcha_Ca_Phe.jpg", recipe: { K38: 0.01, K27: 0.01, K39: 0.1 } },
];

export const seedStaff: Staff[] = [
  { id: "NV01", name: "Nguyễn Văn An", role: "Quản lý", phone: "0901234567", shift: "Sáng" },
  { id: "NV02", name: "Trần Thị Bình", role: "Thu ngân", phone: "0912345678", shift: "Chiều" },
  { id: "NV03", name: "Lê Hoàng Cường", role: "Pha chế", phone: "0923456789", shift: "Sáng" },
  { id: "NV04", name: "Phạm Thu Dung", role: "Phục vụ", phone: "0934567890", shift: "Tối" },
  { id: "NV05", name: "Võ Minh Đức", role: "Pha chế", phone: "0945678901", shift: "Chiều" },
];

export function makeSeedOrders(now = new Date()): Order[] {
  const customers = ["Anh Tuấn", "Chị Lan", "Anh Hùng", "Chị Mai", "Khách lẻ"];
  const out: Order[] = [];
  let n = 1001;
  for (let day = 6; day >= 0; day--) {
    const count = 3 + ((day * 7) % 4);
    for (let k = 0; k < count; k++) {
      const d = new Date(now);
      d.setDate(d.getDate() - day);
      d.setHours(8 + k * 2, (k * 17) % 60, 0, 0);
      const picks = [seedMenu[(n + k) % seedMenu.length]!, seedMenu[(n * 3 + k) % seedMenu.length]!];
      const items: OrderLine[] = picks.map((m, i) => ({ menuId: m.id, name: m.name, price: m.price, qty: 1 + ((n + i) % 2) }));
      const merged = items.filter((it, i) => items.findIndex((x) => x.menuId === it.menuId) === i);
      const total = merged.reduce((s, it) => s + it.price * it.qty, 0);
      const status: OrderStatus = day === 0 && k === count - 1 ? "Đang pha" : n % 9 === 0 ? "Đã hủy" : "Hoàn thành";
      out.push({
        id: "DH" + n,
        customer: customers[n % 5]!,
        phone: n % 5 === 4 ? "" : "09" + String(10000000 + n * 4321).slice(0, 8),
        createdAt: d.toISOString(),
        items: merged,
        total,
        status,
        paid: status === "Hoàn thành",
      });
      n++;
    }
  }
  return out.reverse();
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Doanh thu = tổng đơn đã thanh toán, không tính đơn hủy. */
export const revenueOf = (orders: Order[]) =>
  orders.filter((o) => o.status !== "Đã hủy" && o.paid).reduce((s, o) => s + o.total, 0);

export function last7Days(orders: Order[], now = new Date()) {
  const names = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayOrders = orders.filter((o) => isSameDay(new Date(o.createdAt), d));
    return { d: names[d.getDay()]!, date: d.toLocaleDateString("vi-VN"), v: revenueOf(dayOrders), count: dayOrders.filter((o) => o.status !== "Đã hủy").length };
  });
}

export function topItems(orders: Order[]) {
  const map = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of orders) {
    if (o.status === "Đã hủy") continue;
    for (const it of o.items) {
      const cur = map.get(it.name) ?? { name: it.name, qty: 0, revenue: 0 };
      cur.qty += it.qty;
      cur.revenue += it.qty * it.price;
      map.set(it.name, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.qty - a.qty);
}

/** Tính nguyên liệu tiêu hao cho một giỏ hàng. */
export function consumption(menu: MenuItem[], lines: { menuId: number; qty: number }[]) {
  const need: Record<string, number> = {};
  for (const l of lines) {
    const m = menu.find((x) => x.id === l.menuId);
    if (!m) continue;
    for (const [sid, amt] of Object.entries(m.recipe ?? {})) need[sid] = (need[sid] ?? 0) + amt * l.qty;
  }
  return need;
}

export type Snapshot = { menu: MenuItem[]; stock: StockItem[]; orders: Order[]; staff: Staff[] };

/** Văn bản dữ liệu quán gửi cho AI (dữ liệu thật từ phần mềm). */
export function businessData({ menu, stock, orders, staff }: Snapshot): string {
  const week = last7Days(orders);
  const top = topItems(orders).slice(0, 5);
  const today = orders.filter((o) => isSameDay(new Date(o.createdAt), new Date()));
  const unpaid = orders.filter((o) => !o.paid && o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  return [
    `## MENU (${menu.length} món)`,
    ...menu.map((m) => `- ${m.name} (${m.cat}): M ${vnd(m.price)}${m.priceL ? ` / L ${vnd(m.priceL)}` : ""}`),
    "", "## KHO NGUYÊN LIỆU",
    ...stock.map((s) => `- ${s.name}: ${+s.qty.toFixed(2)} ${s.unit} (tối thiểu ${s.min}, ${s.qty < s.min ? "SẮP HẾT" : "đủ"})`),
    "", `## NHÂN VIÊN (${staff.length})`,
    ...staff.map((s) => `- ${s.name}: ${s.role}, ca ${s.shift}`),
    "", "## DOANH THU 7 NGÀY",
    ...week.map((w) => `- ${w.d} ${w.date}: ${vnd(w.v)} (${w.count} đơn)`),
    `Tổng tuần: ${vnd(week.reduce((s, w) => s + w.v, 0))}. Hôm nay: ${today.length} đơn, ${vnd(revenueOf(today))}.`,
    `Tiền đơn chưa thanh toán: ${vnd(unpaid)}. Số đơn đã hủy: ${orders.filter((o) => o.status === "Đã hủy").length}.`,
    "", "## MÓN BÁN CHẠY",
    ...top.map((t) => `- ${t.name}: ${t.qty} phần, ${vnd(t.revenue)}`),
    "", `## 15 ĐƠN GẦN NHẤT`,
    ...orders.slice(0, 15).map((o) => `- ${o.id} | ${o.customer} | ${fmtDate(o.createdAt)} | ${vnd(o.total)} | ${o.status} | ${o.paid ? "Đã TT" : "Chưa TT"}`),
  ].join("\n");
}
