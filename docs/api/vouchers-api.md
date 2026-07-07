# Vouchers API

Base URL:

```text
/api/v1
```

Module này quản lý voucher/chương trình khuyến mãi.

- Mini App dùng API public để lấy voucher đang hoạt động.
- Admin dùng API protected để quản lý toàn bộ voucher.

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
| `search` | `string` | No | Tìm theo `code`, `title`, `description` |
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
  }
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
