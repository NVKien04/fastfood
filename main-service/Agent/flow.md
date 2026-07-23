---------------------------Người dùng----------------------------------------


[1] Vào trang chủ / xem menu
↓
[2] Chọn pizza → tùy biến (size, đế, topping, 2 nửa vị...)
↓
[3] Thêm vào giỏ hàng → xem lại giỏ, chỉnh số lượng
↓
[4] Checkout: - Đăng nhập / đặt hàng khách vãng lai (guest) - Nhập/chọn địa chỉ giao hàng - Chọn hình thức: Giao hàng / Tự đến lấy - Áp mã giảm giá (nếu có) - Chọn thanh toán: Online / COD
↓
[5] Xác nhận đặt hàng → tạo order (status = "pending")
↓
[6] Màn hình theo dõi đơn hàng (real-time qua Socket.io)
┌─────────────────────────────────────┐
│ pending → preparing → delivering → │
│ awaiting_confirmation │
└─────────────────────────────────────┘
Khách chỉ xem, không thao tác được ở các bước này
↓
[7] Khi status = "awaiting_confirmation":
→ Khách bấm "Tôi đã nhận hàng"
→ Hoặc bấm "Chưa nhận được" (report vấn đề → status = "disputed")
→ Hoặc không làm gì → sau 24h hệ thống tự chuyển "completed"
↓
[8] status = "completed":
→ Mở khung đánh giá (rating + comment)
→ Cộng điểm loyalty
→ Đơn lưu vào lịch sử mua hàng

---

------------------------Nhà hàng----------------------------------------

[1] Nhận thông báo đơn mới (real-time, có thể kèm âm báo)
Order xuất hiện ở tab "Đơn mới" (status = "pending")
↓
[2] Nhà hàng xem chi tiết đơn → bấm "Xác nhận / Bắt đầu làm"
→ status chuyển "preparing"
→ Đơn chuyển sang tab "Đang chuẩn bị"
↓
[3] Làm xong pizza → bấm "Bắt đầu giao" (hoặc "Sẵn sàng lấy" nếu là pickup)
→ status chuyển "delivering" (hoặc "ready_for_pickup")
↓
[4] Nhà hàng tự đi giao xong → quay về bấm "Đã giao thành công"
→ status chuyển "awaiting_confirmation"
→ (Nếu là pickup: khách tự đến lấy → nhà hàng bấm "Đã giao tại quầy"
→ thẳng luôn "completed", không cần bước chờ khách xác nhận
vì giao trực tiếp, đã xác nhận tại chỗ)
↓
[5] Theo dõi đơn ở tab "Chờ khách xác nhận"
→ Nếu khách bấm nhận → tự chuyển "completed", hiện ở tab "Hoàn tất"
→ Nếu khách report "chưa nhận được" → hiện ở tab "Tranh chấp"
cần nhà hàng xử lý thủ công (liên hệ khách, hoàn tiền...)
