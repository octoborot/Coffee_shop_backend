# Notifications API

Base URL:

```text
/api/v1
```

Module này quản lý thông báo cho Mini App và Admin.

Có hai loại thông báo:

- Thông báo cá nhân: `customer_id` có giá trị.
- Thông báo hệ thống: `customer_id = null`.

## Enums

### NotificationType

```text
promo
order
news
```

## Notification Object

```json
{
  "id": "ec6d19d1-a48e-4784-81cb-bdc7bb30198d",
  "customer_id": null,
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "title": "Ưu đãi mới dành cho bạn",
  "description": "Nhập mã HOTDEAL để nhận ưu đãi hôm nay.",
  "type": "promo",
  "image": "https://example.com/promo.jpg",
  "is_read": false,
  "created_at": "2026-07-07T10:00:00.000Z"
}
```

## GET /api/v1/customer/notifications

Lấy thông báo của customer đang đăng nhập, bao gồm:

- Thông báo riêng của customer đó.
- Thông báo hệ thống có `customer_id = null`.

Auth: Bearer token bắt buộc.

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Params

| Field | Type | Required | Description |
|---|---|---:|---|
| `type` | `NotificationType` | No | Lọc theo loại thông báo |
| `is_read` | `boolean` | No | Lọc đã đọc/chưa đọc |
| `page` | `number` | No | Trang hiện tại, mặc định `1` |
| `limit` | `number` | No | Số item/trang, mặc định `10`, tối đa `50` |

### Request Examples

```http
GET /api/v1/customer/notifications
```

```http
GET /api/v1/customer/notifications?type=promo&is_read=false&page=1&limit=10
```

### Success Response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "ec6d19d1-a48e-4784-81cb-bdc7bb30198d",
      "customer_id": null,
      "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
      "title": "Ưu đãi mới dành cho bạn",
      "description": "Nhập mã HOTDEAL để nhận ưu đãi hôm nay.",
      "type": "promo",
      "image": "https://example.com/promo.jpg",
      "is_read": false,
      "created_at": "2026-07-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## PATCH /api/v1/customer/notifications/:id/read

Đánh dấu thông báo đã đọc.

Auth: Bearer token bắt buộc.

### Path Params

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `uuid` | Yes | ID thông báo |

### Request Example

```http
PATCH /api/v1/customer/notifications/ec6d19d1-a48e-4784-81cb-bdc7bb30198d/read
```

### Success Response

Status: `200 OK`

```json
{
  "id": "ec6d19d1-a48e-4784-81cb-bdc7bb30198d",
  "customer_id": null,
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "title": "Ưu đãi mới dành cho bạn",
  "description": "Nhập mã HOTDEAL để nhận ưu đãi hôm nay.",
  "type": "promo",
  "image": "https://example.com/promo.jpg",
  "is_read": true,
  "created_at": "2026-07-07T10:00:00.000Z"
}
```

## GET /api/v1/admin/notifications

Lấy tất cả thông báo cho admin.

Auth: Bearer token bắt buộc.

### Query Params

Giống `GET /api/v1/customer/notifications`.

### Success Response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "ec6d19d1-a48e-4784-81cb-bdc7bb30198d",
      "customer_id": null,
      "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
      "title": "Ưu đãi mới dành cho bạn",
      "description": "Nhập mã HOTDEAL để nhận ưu đãi hôm nay.",
      "type": "promo",
      "image": "https://example.com/promo.jpg",
      "is_read": false,
      "created_at": "2026-07-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## GET /api/v1/admin/notifications/:id

Lấy chi tiết thông báo cho admin.

Auth: Bearer token bắt buộc.

### Success Response

Status: `200 OK`

```json
{
  "id": "ec6d19d1-a48e-4784-81cb-bdc7bb30198d",
  "customer_id": null,
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "title": "Ưu đãi mới dành cho bạn",
  "description": "Nhập mã HOTDEAL để nhận ưu đãi hôm nay.",
  "type": "promo",
  "image": "https://example.com/promo.jpg",
  "is_read": false,
  "created_at": "2026-07-07T10:00:00.000Z"
}
```

## POST /api/v1/admin/notifications

Tạo thông báo.

Auth: Bearer token bắt buộc.

### Request Body

| Field | Type | Required | Description |
|---|---|---:|---|
| `customer_id` | `uuid` | No | Nếu null/không gửi thì là thông báo hệ thống |
| `title` | `string` | Yes | Tiêu đề thông báo |
| `description` | `string` | Yes | Nội dung thông báo |
| `type` | `NotificationType` | Yes | Loại thông báo |
| `image` | `string` | No | URL ảnh |

### Request Example: System Notification

```json
{
  "title": "Ưu đãi mới dành cho bạn",
  "description": "Nhập mã HOTDEAL để nhận ưu đãi hôm nay.",
  "type": "promo",
  "image": "https://example.com/promo.jpg"
}
```

### Request Example: Customer Notification

```json
{
  "customer_id": "8bcb97ac-d07c-4f73-96a8-74d9a69deac2",
  "title": "Đơn hàng đang được chuẩn bị",
  "description": "Đơn hàng #BB-2094 của bạn đang được chuẩn bị.",
  "type": "order"
}
```

### Success Response

Status: `201 Created`

```json
{
  "id": "ec6d19d1-a48e-4784-81cb-bdc7bb30198d",
  "customer_id": null,
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "title": "Ưu đãi mới dành cho bạn",
  "description": "Nhập mã HOTDEAL để nhận ưu đãi hôm nay.",
  "type": "promo",
  "image": "https://example.com/promo.jpg",
  "is_read": false,
  "created_at": "2026-07-07T10:00:00.000Z"
}
```

## PATCH /api/v1/admin/notifications/:id

Cập nhật thông báo.

Auth: Bearer token bắt buộc.

### Request Example

```json
{
  "title": "Ưu đãi cuối tuần",
  "description": "Áp dụng mã WEEKEND cho đơn hàng cuối tuần.",
  "type": "promo",
  "image": "https://example.com/weekend.jpg"
}
```

### Success Response

Status: `200 OK`

```json
{
  "id": "ec6d19d1-a48e-4784-81cb-bdc7bb30198d",
  "customer_id": null,
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "title": "Ưu đãi cuối tuần",
  "description": "Áp dụng mã WEEKEND cho đơn hàng cuối tuần.",
  "type": "promo",
  "image": "https://example.com/weekend.jpg",
  "is_read": false,
  "created_at": "2026-07-07T10:00:00.000Z"
}
```

## DELETE /api/v1/admin/notifications/:id

Xóa thông báo.

Auth: Bearer token bắt buộc.

### Success Response

Status: `200 OK`

```json
{
  "message": "Đã xóa thông báo thành công."
}
```

## Common Errors

### 401 Unauthorized

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 404 Not Found

```json
{
  "message": "Không tìm thấy thông báo.",
  "error": "Not Found",
  "statusCode": 404
}
```

### 400 Bad Request

```json
{
  "message": ["type must be one of the following values: promo, order, news"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Current Limitation

Hiện tại `is_read` nằm trực tiếp trên bảng `notifications`.

Với thông báo hệ thống (`customer_id = null`), nếu một khách đánh dấu đã đọc thì record đó sẽ thành đã đọc ở cấp database. Nếu muốn mỗi khách có trạng thái đọc riêng, sau này nên tách thêm bảng:

```text
customer_notifications
```

Thiết kế hiện tại phù hợp cho MVP/demo hoặc thông báo đơn giản.
