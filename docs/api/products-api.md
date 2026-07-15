# Products API

Base URL:

```text
/api/v1/products
```

Ảnh sản phẩm được tải lên Cloudinary qua API admin. Response sản phẩm có
`image` để hiển thị và `image_public_id` để backend quản lý vòng đời file.

## POST /api/v1/products/images

Tải ảnh sản phẩm lên Cloudinary. Auth Bearer token bắt buộc. Request dùng
`multipart/form-data`, field `file`; hỗ trợ JPEG, PNG, WebP, GIF, tối đa 5 MB.

```json
{
  "url": "https://res.cloudinary.com/example/image/upload/product.webp",
  "publicId": "coffee-shop/products/caramel-macchiato",
  "width": 1200,
  "height": 1200
}
```

## DELETE /api/v1/products/images

Xóa ảnh sản phẩm tạm chưa gắn vào sản phẩm. Chỉ chấp nhận public ID thuộc
thư mục `coffee-shop/products/`.

```json
{
  "public_id": "coffee-shop/products/caramel-macchiato"
}
```

Module này phục vụ hai nhóm chức năng:

- Mini App đọc danh sách sản phẩm để render `ProductCard`.
- Admin quản lý sản phẩm và tag sản phẩm.

## Enums

### ProductCategory

```text
Coffee
Tea
Juice
Pastry
```

### ProductStatus

```text
Available
OutOfStock
```

Lưu ý: `OutOfStock` được Prisma map với database value `Out of Stock`.

## Response ProductCard

Các API đọc sản phẩm trả sản phẩm theo format:

```json
{
  "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
  "name": "Caramel Macchiato",
  "subname": "Caramel Macchiato Đá",
  "category": "Coffee",
  "price": 1.8,
  "priceVnd": 45000,
  "rating": 4.8,
  "image": "https://example.com/caramel.jpg",
  "status": "Available",
  "details": "Size M • Ít đường • Nhiều đá",
  "description": "Sự hòa quyện giữa espresso, sữa và caramel.",
  "tags": ["Best Seller", "Bán Chạy"]
}
```

## GET /api/v1/products

Lấy danh sách sản phẩm cho Mini App.

Auth: Không cần token.

### Query Params

| Field | Type | Required | Description |
|---|---|---:|---|
| `category` | `ProductCategory` | No | Lọc theo danh mục sản phẩm |
| `status` | `ProductStatus` | No | Lọc theo trạng thái còn hàng/hết hàng |
| `tag` | `string` | No | Lọc sản phẩm có tag tương ứng |
| `search` | `string` | No | Tìm theo `name`, `subname`, `description`, `details` |
| `page` | `number` | No | Trang hiện tại, mặc định `1` |
| `limit` | `number` | No | Số item/trang, mặc định `10`, tối đa `50` |

### Request Examples

```http
GET /api/v1/products
```

```http
GET /api/v1/products?category=Coffee&status=Available&page=1&limit=10
```

```http
GET /api/v1/products?tag=Best%20Seller
```

```http
GET /api/v1/products?search=matcha
```

### Success Response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
      "name": "Caramel Macchiato",
      "subname": "Caramel Macchiato Đá",
      "category": "Coffee",
      "price": 1.8,
      "priceVnd": 45000,
      "rating": 4.8,
      "image": "https://example.com/caramel.jpg",
      "status": "Available",
      "details": "Size M • Ít đường • Nhiều đá",
      "description": "Sự hòa quyện giữa espresso, sữa và caramel.",
      "tags": ["Best Seller", "Bán Chạy"]
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

## GET /api/v1/products/:id

Lấy chi tiết một sản phẩm.

Auth: Không cần token.

### Path Params

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `uuid` | Yes | ID sản phẩm |

### Request Example

```http
GET /api/v1/products/c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461
```

### Success Response

Status: `200 OK`

```json
{
  "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
  "name": "Caramel Macchiato",
  "subname": "Caramel Macchiato Đá",
  "category": "Coffee",
  "price": 1.8,
  "priceVnd": 45000,
  "rating": 4.8,
  "image": "https://example.com/caramel.jpg",
  "status": "Available",
  "details": "Size M • Ít đường • Nhiều đá",
  "description": "Sự hòa quyện giữa espresso, sữa và caramel.",
  "tags": ["Best Seller", "Bán Chạy"]
}
```

### Error Response

Status: `404 Not Found`

```json
{
  "message": "Sản phẩm với ID c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461 không tồn tại",
  "error": "Not Found",
  "statusCode": 404
}
```

## POST /api/v1/products

Tạo sản phẩm mới.

Auth: Bearer token bắt buộc.

Role hiện tại: API đang dùng `JwtAuthGuard`, chưa enforce role `admin/staff` bằng `RolesGuard`.

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body

| Field | Type | Required | Description |
|---|---|---:|---|
| `name` | `string` | Yes | Tên sản phẩm |
| `subname` | `string` | No | Tên phụ/tên tiếng Việt |
| `category` | `ProductCategory` | Yes | Danh mục |
| `price` | `number` | Yes | Giá quy đổi, ví dụ USD nội bộ |
| `price_vnd` | `number` | Yes | Giá VND hiển thị cho Mini App |
| `rating` | `number` | No | Điểm đánh giá, từ `0` đến `5` |
| `image` | `string` | No | URL ảnh |
| `status` | `ProductStatus` | No | Mặc định `Available` |
| `details` | `string` | No | Thông tin ngắn |
| `description` | `string` | No | Mô tả chi tiết |
| `tags` | `string[]` | No | Tag tạo kèm sản phẩm |

### Request Example

```json
{
  "name": "Caramel Macchiato",
  "subname": "Caramel Macchiato Đá",
  "category": "Coffee",
  "price": 1.8,
  "price_vnd": 45000,
  "rating": 4.8,
  "image": "https://example.com/caramel.jpg",
  "status": "Available",
  "details": "Size M • Ít đường • Nhiều đá",
  "description": "Sự hòa quyện giữa espresso, sữa và caramel.",
  "tags": ["Best Seller", "Bán Chạy"]
}
```

### Success Response

Status: `201 Created`

```json
{
  "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
  "name": "Caramel Macchiato",
  "subname": "Caramel Macchiato Đá",
  "category": "Coffee",
  "price": 1.8,
  "priceVnd": 45000,
  "rating": 4.8,
  "image": "https://example.com/caramel.jpg",
  "status": "Available",
  "details": "Size M • Ít đường • Nhiều đá",
  "description": "Sự hòa quyện giữa espresso, sữa và caramel.",
  "tags": ["Best Seller", "Bán Chạy"]
}
```

## PATCH /api/v1/products/:id

Cập nhật sản phẩm.

Auth: Bearer token bắt buộc.

### Request Example

```http
PATCH /api/v1/products/c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461
```

```json
{
  "price_vnd": 49000,
  "status": "Available",
  "description": "Mô tả mới của sản phẩm."
}
```

### Success Response

Status: `200 OK`

```json
{
  "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
  "name": "Caramel Macchiato",
  "subname": "Caramel Macchiato Đá",
  "category": "Coffee",
  "price": 1.8,
  "priceVnd": 49000,
  "rating": 4.8,
  "image": "https://example.com/caramel.jpg",
  "status": "Available",
  "details": "Size M • Ít đường • Nhiều đá",
  "description": "Mô tả mới của sản phẩm.",
  "tags": ["Best Seller", "Bán Chạy"]
}
```

## DELETE /api/v1/products/:id

Xóa sản phẩm.

Auth: Bearer token bắt buộc.

### Success Response

Status: `200 OK`

```json
{
  "message": "Đã xóa sản phẩm thành công."
}
```

## POST /api/v1/products/:id/tags

Thêm tag cho sản phẩm.

Auth: Bearer token bắt buộc.

### Request Body

```json
{
  "name": "Best Seller"
}
```

### Success Response

Status: `201 Created`

```json
{
  "id": "54d8a0f4-2634-47de-b91e-0867dc8c53f1",
  "product_id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "updated_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "name": "Best Seller",
  "created_at": "2026-07-07T10:00:00.000Z",
  "updated_at": "2026-07-07T10:00:00.000Z"
}
```

## PATCH /api/v1/products/:id/tags/:tagId

Cập nhật tag sản phẩm.

Auth: Bearer token bắt buộc.

### Request Body

```json
{
  "name": "Bán Chạy"
}
```

### Success Response

Status: `200 OK`

```json
{
  "id": "54d8a0f4-2634-47de-b91e-0867dc8c53f1",
  "product_id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
  "created_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "updated_by_admin_id": "f4a0194f-8e5d-4503-8142-b34d6afdcae1",
  "name": "Bán Chạy",
  "created_at": "2026-07-07T10:00:00.000Z",
  "updated_at": "2026-07-07T10:10:00.000Z"
}
```

## DELETE /api/v1/products/:id/tags/:tagId

Xóa tag sản phẩm.

Auth: Bearer token bắt buộc.

### Success Response

Status: `200 OK`

```json
{
  "message": "Đã xóa tag sản phẩm thành công."
}
```

## Common Errors

### 401 Unauthorized

Khi gọi API admin nhưng thiếu token hoặc token không hợp lệ.

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 400 Bad Request

Khi enum sai hoặc body không đúng định dạng.

```json
{
  "message": ["category must be one of the following values: Coffee, Tea, Juice, Pastry"],
  "error": "Bad Request",
  "statusCode": 400
}
```
