import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "@/lib/store";
import { revenueOf, seedMenu, seedStock } from "@/lib/data";

const qty = (id: string) => useStore.getState().stock.find((s) => s.id === id)!.qty;

describe("quy tắc quán", () => {
  beforeEach(() => useStore.getState().resetData());

  it("đăng nhập đúng admin/123456, sai thì từ chối", () => {
    expect(useStore.getState().login("admin", "sai")).toBe(false);
    expect(useStore.getState().login("admin", "123456")).toBe(true);
  });

  it("bán 2 cà phê sữa trừ kho theo công thức và hủy đơn thì hoàn kho", () => {
    const before = qty("K03");
    const o = useStore.getState().createOrder({ customer: "", phone: "", lines: [{ menuId: 2, qty: 2 }], paid: true })!;
    expect(o.total).toBe(60000); // Cafe Sữa Size M = 30.000đ
    expect(o.items[0]!.name).toBe("Cafe Sữa");
    expect(o.customer).toBe("Khách lẻ");
    expect(qty("K03")).toBeCloseTo(before - 0.2);
    useStore.getState().setStatus(o.id, "Đã hủy");
    expect(qty("K03")).toBeCloseTo(before);
  });

  it("đơn Size L dùng giá L và ghi nhãn size trên dòng món", () => {
    const o = useStore.getState().createOrder({ customer: "", phone: "", lines: [{ menuId: 1, qty: 1, price: 32000, label: "Size L" }], paid: true })!;
    expect(o.total).toBe(32000); // Cafe Đen Size L = 32.000đ
    expect(o.items[0]!.name).toBe("Cafe Đen (Size L)");
  });

  it("mọi món đều có công thức và chỉ dùng nguyên liệu có trong kho", () => {
    const ids = new Set(seedStock.map((s) => s.id));
    for (const m of seedMenu) {
      const keys = Object.keys(m.recipe ?? {});
      expect(keys.length, `Công thức trống: ${m.name}`).toBeGreaterThan(0);
      for (const k of keys) expect(ids.has(k), `${m.name} dùng nguyên liệu lạ: ${k}`).toBe(true);
    }
  });

  it("kho có đủ 40 nguyên liệu theo danh sách HIVER", () => {
    expect(seedStock.length).toBe(40);
    for (const name of ["Cà phê rang xay", "Cà phê hạt pha Espresso", "Bột cacao", "Cascara (vỏ quả cà phê khô)", "Kem phô mai", "Trà nền pha chế", "Syrup ổi hồng", "Đá viên", "Nước lọc"]) {
      expect(seedStock.some((s) => s.name === name), `Thiếu nguyên liệu: ${name}`).toBe(true);
    }
  });

  it("doanh thu chỉ tính đơn đã thanh toán và không bị hủy", () => {
    const base = { customer: "", phone: "", createdAt: "", items: [] };
    expect(revenueOf([
      { ...base, id: "a", total: 100, status: "Hoàn thành", paid: true },
      { ...base, id: "b", total: 50, status: "Hoàn thành", paid: false },
      { ...base, id: "c", total: 70, status: "Đã hủy", paid: true },
    ])).toBe(100);
  });
});
