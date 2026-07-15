# Vouchers API

Base URL:

```text
/api/v1
```

Module này quản lý voucher/chương trình khuyến mãi.

- Mini App dùng API public để lấy voucher đang hoạt động.
- Admin dùng API protected để quản lý toàn bộ voucher.

Ảnh voucher được tải lên Cloudinary qua API admin. Backend chịu trách nhiệm
tìm kiếm, lọc, phân trang, xác định trạng thái nghiệp vụ và tổng hợp thống kê.

### VoucherStatus

```text
RUNNING
SCHEDULED
PAUSED
EXPIRED
EXHAUSTED
```

Thứ tự xác định trạng thái: `PAUSED`, `SCHEDULED`, `EXPIRED`, `EXHAUSTED`,
cuối cùng là `RUNNING`.

## Enums

### DiscountType

```text
PERCENT
FIXED_AMOUNT
BUY_ONE_GET_ONE
```

### ProductCategory

```text
Coffee
Tea
Juice
Pastry
```

## Voucher Object

```json
{
  "id": "07d0c689-9728-44f4-a9d7-517117eb13a5",
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "updated_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "code": "HOTDEAL",
  "title": "Mua 1 tặng 1",
  "description": "Áp dụng cho Coffee và Tea.",
  "image": "https://example.com/voucher.jpg",
  "image_public_id": "coffee-shop/vouchers/hotdeal",
  "discount_type": "BUY_ONE_GET_ONE",
  "discount_value": 0,
  "min_order_vnd": 0,
  "max_discount_vnd": 50000,
  "applicable_categories": ["Coffee", "Tea"],
  "starts_at": "2026-07-01T00:00:00.000Z",
  "ends_at": "2026-07-31T23:59:59.000Z",
  "usage_limit": 100,
  "used_count": 0,
  "is_active": true,
  "status": "RUNNING",
  "created_at": "2026-07-07T10:00:00.000Z",
  "updated_at": "2026-07-07T10:00:00.000Z"
}
```

## GET /api/v1/vouchers

Lấy danh sách voucher đang hoạt động cho Mini App.

Auth: Không cần token.

Chỉ trả voucher thỏa điều kiện:

```text
is_active = true
starts_at <= now hoặc starts_at = null
ends_at >= now hoặc ends_at = null
```

### Query Params

| Field | Type | Required | Description |
|---|---|---:|---|
| `discount_type` | `DiscountType` | No | Lọc theo loại giảm giá |
| `category` | `ProductCategory` | No | Lọc voucher áp dụng cho category |
| `is_active` | `boolean` | No | Lọc trạng thái active |
| `status` | `VoucherStatus` | No | Lọc theo trạng thái nghiệp vụ |
| `search` | `string` | No | Tìm theo `code`, `title`, `description` |
| `starts_from` | `ISO date string` | No | Bắt đầu từ thời điểm |
| `starts_to` | `ISO date string` | No | Bắt đầu trước thời điểm |
| `ends_from` | `ISO date string` | No | Kết thúc từ thời điểm |
| `ends_to` | `ISO date string` | No | Kết thúc trước thời điểm |
| `sort_by` | `string` | No | `created_at`, `updated_at`, `starts_at`, `ends_at`, `used_count`, `code` |
| `sort_order` | `asc \| desc` | No | Mặc định `desc` |
| `page` | `number` | No | Trang hiện tại, mặc định `1` |
| `limit` | `number` | No | Số item/trang, mặc định `10`, tối đa `50` |

### Request Examples

```http
GET /api/v1/vouchers
```

```http
GET /api/v1/vouchers?category=Coffee&discount_type=BUY_ONE_GET_ONE
```

```http
GET /api/v1/vouchers?search=HOT&page=1&limit=10
```

### Success Response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "07d0c689-9728-44f4-a9d7-517117eb13a5",
      "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
      "updated_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
      "code": "HOTDEAL",
      "title": "Mua 1 tặng 1",
      "description": "Áp dụng cho Coffee và Tea.",
      "image": "https://example.com/voucher.jpg",
      "discount_type": "BUY_ONE_GET_ONE",
      "discount_value": 0,
      "min_order_vnd": 0,
      "max_discount_vnd": 50000,
      "applicable_categories": ["Coffee", "Tea"],
      "starts_at": "2026-07-01T00:00:00.000Z",
      "ends_at": "2026-07-31T23:59:59.000Z",
      "usage_limit": 100,
      "used_count": 0,
      "is_active": true,
      "created_at": "2026-07-07T10:00:00.000Z",
      "updated_at": "2026-07-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "summary": {
    "total": 1,
    "running": 1,
    "scheduled": 0,
    "paused": 0,
    "expired": 0,
    "exhausted": 0,
    "totalUsedCount": 0
  }
}
```

`summary` áp dụng bộ lọc tìm kiếm, loại giảm giá, danh mục và thời gian nhưng
không áp dụng `status`/`is_active`, nhờ đó admin vẫn thấy tổng quan các trạng thái.

## POST /api/v1/admin/vouchers/images

Tải ảnh voucher lên Cloudinary. Auth Bearer token bắt buộc. Request dùng
`multipart/form-data`, field `file`; hỗ trợ JPEG, PNG, WebP, GIF, tối đa 5 MB.

```json
{
  "url": "https://res.cloudinary.com/example/image/upload/voucher.webp",
  "publicId": "coffee-shop/vouchers/hotdeal",
  "width": 1600,
  "height": 900
}
```

## DELETE /api/v1/admin/vouchers/images

Xóa ảnh voucher tạm chưa gắn với voucher. Chỉ chấp nhận public ID thuộc thư mục
`coffee-shop/vouchers/`.

```json
{
  "public_id": "coffee-shop/vouchers/hotdeal"
}
```

## PATCH /api/v1/admin/vouchers/:id/status

Bật hoặc tắt voucher bằng endpoint riêng cho switch trạng thái.

```json
{
  "is_active": false
}
```

## GET /api/v1/vouchers/code/:code

Lấy voucher theo mã.

Auth: Không cần token.

### Request Example

```http
GET /api/v1/vouchers/code/HOTDEAL
```

### Success Response

Status: `200 OK`

```json
{
  "id": "07d0c689-9728-44f4-a9d7-517117eb13a5",
  "code": "HOTDEAL",
  "title": "Mua 1 tặng 1",
  "description": "Áp dụng cho Coffee và Tea.",
  "image": "https://example.com/voucher.jpg",
  "discount_type": "BUY_ONE_GET_ONE",
  "discount_value": 0,
  "min_order_vnd": 0,
  "max_discount_vnd": 50000,
  "applicable_categories": ["Coffee", "Tea"],
  "starts_at": "2026-07-01T00:00:00.000Z",
  "ends_at": "2026-07-31T23:59:59.000Z",
  "usage_limit": 100,
  "used_count": 0,
  "is_active": true,
  "created_at": "2026-07-07T10:00:00.000Z",
  "updated_at": "2026-07-07T10:00:00.000Z"
}
```

### Error Response

Status: `404 Not Found`

```json
{
  "message": "Không tìm thấy voucher.",
  "error": "Not Found",
  "statusCode": 404
}
```

## GET /api/v1/admin/vouchers

Lấy toàn bộ voucher cho admin, bao gồm cả inactive/hết hạn.

Auth: Bearer token bắt buộc.

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Params

Giống `GET /api/v1/vouchers`.

### Success Response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "07d0c689-9728-44f4-a9d7-517117eb13a5",
      "code": "HOTDEAL",
      "title": "Mua 1 tặng 1",
      "discount_type": "BUY_ONE_GET_ONE",
      "discount_value": 0,
      "is_active": true,
      "used_count": 0
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

## GET /api/v1/admin/vouchers/:id

Lấy chi tiết voucher cho admin.

Auth: Bearer token bắt buộc.

### Success Response

Status: `200 OK`

```json
{
  "id": "07d0c689-9728-44f4-a9d7-517117eb13a5",
  "code": "HOTDEAL",
  "title": "Mua 1 tặng 1",
  "description": "Áp dụng cho Coffee và Tea.",
  "discount_type": "BUY_ONE_GET_ONE",
  "discount_value": 0,
  "applicable_categories": ["Coffee", "Tea"],
  "is_active": true
}
```

## POST /api/v1/admin/vouchers

Tạo voucher.

Auth: Bearer token bắt buộc.

### Request Body

| Field | Type | Required | Description |
|---|---|---:|---|
| `code` | `string` | Yes | Mã voucher, unique |
| `title` | `string` | Yes | Tên chương trình |
| `description` | `string` | No | Mô tả voucher |
| `image` | `string` | No | URL ảnh voucher |
| `discount_type` | `DiscountType` | Yes | Loại giảm giá |
| `discount_value` | `number` | Yes | Giá trị giảm |
| `min_order_vnd` | `number` | No | Giá trị đơn tối thiểu |
| `max_discount_vnd` | `number` | No | Mức giảm tối đa |
| `applicable_categories` | `ProductCategory[]` | No | Danh mục áp dụng |
| `starts_at` | `ISO date string` | No | Thời gian bắt đầu |
| `ends_at` | `ISO date string` | No | Thời gian kết thúc |
| `usage_limit` | `number` | No | Giới hạn số lượt dùng |
| `is_active` | `boolean` | No | Trạng thái hoạt động |

### Request Example

```json
{
  "code": "HOTDEAL",
  "title": "Mua 1 tặng 1",
  "description": "Áp dụng cho Coffee và Tea.",
  "image": "https://example.com/voucher.jpg",
  "discount_type": "BUY_ONE_GET_ONE",
  "discount_value": 0,
  "min_order_vnd": 0,
  "max_discount_vnd": 50000,
  "applicable_categories": ["Coffee", "Tea"],
  "starts_at": "2026-07-01T00:00:00.000Z",
  "ends_at": "2026-07-31T23:59:59.000Z",
  "usage_limit": 100,
  "is_active": true
}
```

### Success Response

Status: `201 Created`

```json
{
  "id": "07d0c689-9728-44f4-a9d7-517117eb13a5",
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "updated_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "code": "HOTDEAL",
  "title": "Mua 1 tặng 1",
  "description": "Áp dụng cho Coffee và Tea.",
  "image": "https://example.com/voucher.jpg",
  "discount_type": "BUY_ONE_GET_ONE",
  "discount_value": 0,
  "min_order_vnd": 0,
  "max_discount_vnd": 50000,
  "applicable_categories": ["Coffee", "Tea"],
  "starts_at": "2026-07-01T00:00:00.000Z",
  "ends_at": "2026-07-31T23:59:59.000Z",
  "usage_limit": 100,
  "used_count": 0,
  "is_active": true,
  "created_at": "2026-07-07T10:00:00.000Z",
  "updated_at": "2026-07-07T10:00:00.000Z"
}
```

## PATCH /api/v1/admin/vouchers/:id

Cập nhật voucher.

Auth: Bearer token bắt buộc.

### Request Example

```json
{
  "title": "Mua 1 tặng 1 cuối tuần",
  "is_active": false
}
```

### Success Response

Status: `200 OK`

```json
{
  "id": "07d0c689-9728-44f4-a9d7-517117eb13a5",
  "code": "HOTDEAL",
  "title": "Mua 1 tặng 1 cuối tuần",
  "is_active": false
}
```

## DELETE /api/v1/admin/vouchers/:id

Xóa voucher.

Auth: Bearer token bắt buộc.

### Success Response

Status: `200 OK`

```json
{
  "message": "Đã xóa voucher thành công."
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
  "message": "Không tìm thấy voucher.",
  "error": "Not Found",
  "statusCode": 404
}
```

### 400 Bad Request

```json
{
  "message": ["discount_type must be one of the following values: PERCENT, FIXED_AMOUNT, BUY_ONE_GET_ONE"],
  "error": "Bad Request",
  "statusCode": 400
}
```
