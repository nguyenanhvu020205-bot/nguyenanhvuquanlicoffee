const RULES = `Bạn là "Trợ lý HIVER" — trợ lý AI trong phần mềm quản lý quán cà phê HIVER.
Quy tắc bắt buộc:
- Luôn trả lời bằng tiếng Việt, giọng thân thiện, ngắn gọn, có cấu trúc (markdown, gạch đầu dòng).
- CHỈ dùng số liệu trong phần DỮ LIỆU dưới đây. Không bịa thêm số liệu, món hay đơn hàng không có trong dữ liệu.
- Nếu câu hỏi cần dữ liệu không có trong phần DỮ LIỆU, nói rõ bạn chưa có dữ liệu đó và gợi ý câu hỏi khác.
- Tiền hiển thị dạng "85.000 đ".`;

export function assistantSystem(context: string): string {
  const data = context.trim().slice(0, 20000) || "(chưa có dữ liệu)";
  return `${RULES}\n\n# DỮ LIỆU QUÁN (cập nhật từ phần mềm)\n${data}`;
}

export function reportPrompt(): string {
  return `Hãy viết BÁO CÁO TUẦN cho quán gồm:
1. Tổng kết doanh thu 7 ngày (tổng, ngày cao nhất, ngày thấp nhất).
2. Phân tích đơn hàng gần đây: số đơn, đơn đã hủy, số tiền chưa được thanh toán.
3. Cảnh báo nguyên liệu sắp hết (dưới mức tối thiểu).
4. 2-3 gợi ý cụ thể để tăng doanh thu tuần tới.
Viết ngắn gọn (khoảng 250 từ), dùng gạch đầu dòng, in đậm các con số quan trọng.`;
}

export function menuIdeasPrompt(): string {
  return `Quán hiện có các món trong dữ liệu. Hãy gợi ý 3 món MỚI phù hợp để bổ sung menu (không trùng món hiện có), mỗi món gồm: tên, danh mục, giá bán đề xuất (đồng, hợp lý so với giá hiện tại) và 1-2 câu mô tả bán hấp dẫn. Cuối cùng, gợi ý 1 món hiện có nên đưa vào khuyến mãi và nêu lý do.`;
}

export function stockPrompt(): string {
  return `Dựa trên tồn kho, mức tối thiểu và menu hiện tại, hãy lập DANH SÁCH NGUYÊN LIỆU CẦN MUA TUẦN TỚI: liệt kê nguyên liệu cần mua trước (đặc biệt những loại sắp hết), số lượng đề xuất (đơn vị như trong dữ liệu), lý do ngắn gọn và mức độ ưu tiên (Cao/Trung bình). Nếu món nào không cần mua thêm, không cần liệt kê.`;
}

export function salesPrompt(moTa: string): string {
  return `Một khách hàng vừa mô tả ý muốn của họ: "${moTa}".
Từ MENU hiện có, hãy gợi ý 2-3 món phù hợp nhất: tên món, giá bán, và một câu giải thích tại sao món đó phù hợp với lời mô tả của khách. Nếu mô tả quá mơ hồ, hãy hỏi lại một câu ngắn để làm rõ trước khi gợi ý.`;
}
