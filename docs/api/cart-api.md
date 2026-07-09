# Cart API

Base URL:

```text
/api/v1/customer/cart
```

Module này quản lý giỏ hàng của customer đã đăng nhập.

- Mỗi customer có một cart riêng.
- Tất cả API cart đều yêu cầu Bearer token.
- Cart item lưu `product_id`, `quantity`, `options`; giá sản phẩm được lấy từ bảng `products` tại thời điểm đọc cart.
- Khi thêm sản phẩm đã tồn tại trong cart với cùng `product_id` và cùng `options`, hệ thống cộng dồn `quantity`.

## Auth

Tất cả endpoint trong file này cần header:

```http
Authorization: Bearer <access_token>
```

Token phải là token của customer. API lấy customer id từ `req.user.id` sau khi qua `JwtAuthGuard`.

## Cart Object

Các API cart trả về cart theo format:

```json
{
  "id": "4b481533-1ef2-48e6-b1a5-8b1869863610",
  "customer_id": "6fa86d0b-322f-4325-8d23-7fc4fa9ec1a7",
  "items": [
    {
      "id": "aa75d218-0a83-4565-9db6-f9a9c5664c8d",
      "product_id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
      "quantity": 2,
      "options": {
        "size": "M",
        "sweetness": "50%",
        "ice": "100%"
      },
      "product": {
        "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
        "name": "Caramel Macchiato",
        "subname": "Caramel Macchiato Đá",
        "price_vnd": 45000,
        "image": "https://example.com/caramel.jpg",
        "status": "Available"
      },
      "line_total_vnd": 90000
    }
  ],
  "subtotal_vnd": 90000
}
```

### Field Notes

| Field | Type | Description |
|---|---|---|
| `id` | `uuid` | ID cart |
| `customer_id` | `uuid` | ID customer sở hữu cart |
| `items` | `CartItem[]` | Danh sách sản phẩm trong cart |
| `items[].options` | `object \| null` | Tùy chọn món như size, đường, đá |
| `items[].line_total_vnd` | `number` | `product.price_vnd * quantity` |
| `subtotal_vnd` | `number` | Tổng tiền tất cả item trong cart |

## GET /api/v1/customer/cart

Lấy giỏ hàng hiện tại của customer.

Nếu customer chưa có cart, API tự tạo cart rỗng và trả về cart đó.

Auth: Bearer token bắt buộc.

### Request Example

```http
GET /api/v1/customer/cart
Authorization: Bearer <access_token>
```

### Success Response

Status: `200 OK`

```json
{
  "id": "4b481533-1ef2-48e6-b1a5-8b1869863610",
  "customer_id": "6fa86d0b-322f-4325-8d23-7fc4fa9ec1a7",
  "items": [],
  "subtotal_vnd": 0
}
```

## POST /api/v1/customer/cart/items

Thêm sản phẩm vào giỏ hàng.

Auth: Bearer token bắt buộc.

API chỉ cho thêm sản phẩm tồn tại và có trạng thái `Available`.

Nếu trong cart đã có item cùng `product_id` và cùng `options`, API cộng thêm `quantity` vào item cũ. Nếu khác `options`, API tạo cart item mới.

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body

| Field | Type | Required | Description |
|---|---|---:|---|
| `product_id` | `uuid` | Yes | ID sản phẩm |
| `quantity` | `number` | Yes | Số lượng, phải lớn hơn `0` |
| `options` | `object` | No | Tùy chọn món |

### Request Example

```json
{
  "product_id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
  "quantity": 2,
  "options": {
    "size": "M",
    "sweetness": "50%",
    "ice": "100%"
  }
}
```

### Success Response

Status: `201 Created`

```json
{
  "id": "4b481533-1ef2-48e6-b1a5-8b1869863610",
  "customer_id": "6fa86d0b-322f-4325-8d23-7fc4fa9ec1a7",
  "items": [
    {
      "id": "aa75d218-0a83-4565-9db6-f9a9c5664c8d",
      "product_id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
      "quantity": 2,
      "options": {
        "size": "M",
        "sweetness": "50%",
        "ice": "100%"
      },
      "product": {
        "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
        "name": "Caramel Macchiato",
        "subname": "Caramel Macchiato Đá",
        "price_vnd": 45000,
        "image": "https://example.com/caramel.jpg",
        "status": "Available"
      },
      "line_total_vnd": 90000
    }
  ],
  "subtotal_vnd": 90000
}
```

### Error Response

Status: `400 Bad Request`

```json
{
  "message": "Sản phẩm không tồn tại hoặc đã hết hàng.",
  "error": "Bad Request",
  "statusCode": 400
}
```

## PATCH /api/v1/customer/cart/items/:id

Cập nhật một item trong giỏ hàng.

Auth: Bearer token bắt buộc.

API chỉ cho update cart item thuộc customer hiện tại.

### Path Params

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `uuid` | Yes | ID cart item |

### Request Body

| Field | Type | Required | Description |
|---|---|---:|---|
| `quantity` | `number` | No | Số lượng mới, phải lớn hơn `0` nếu truyền lên |
| `options` | `object` | No | Tùy chọn món mới |

### Request Example

```http
PATCH /api/v1/customer/cart/items/aa75d218-0a83-4565-9db6-f9a9c5664c8d
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "quantity": 3,
  "options": {
    "size": "L",
    "sweetness": "30%",
    "ice": "50%"
  }
}
```

### Success Response

Status: `200 OK`

```json
{
  "id": "4b481533-1ef2-48e6-b1a5-8b1869863610",
  "customer_id": "6fa86d0b-322f-4325-8d23-7fc4fa9ec1a7",
  "items": [
    {
      "id": "aa75d218-0a83-4565-9db6-f9a9c5664c8d",
      "product_id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
      "quantity": 3,
      "options": {
        "size": "L",
        "sweetness": "30%",
        "ice": "50%"
      },
      "product": {
        "id": "c2ad72e1-9436-4dc7-8a7f-bf7ecbc92461",
        "name": "Caramel Macchiato",
        "subname": "Caramel Macchiato Đá",
        "price_vnd": 45000,
        "image": "https://example.com/caramel.jpg",
        "status": "Available"
      },
      "line_total_vnd": 135000
    }
  ],
  "subtotal_vnd": 135000
}
```

### Error Response

Status: `404 Not Found`

```json
{
  "message": "Sản phẩm trong giỏ hàng không tồn tại",
  "error": "Not Found",
  "statusCode": 404
}
```

## DELETE /api/v1/customer/cart/items/:id

Xóa một item khỏi giỏ hàng.

Auth: Bearer token bắt buộc.

API chỉ cho xóa cart item thuộc customer hiện tại.

### Path Params

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `uuid` | Yes | ID cart item |

### Request Example

```http
DELETE /api/v1/customer/cart/items/aa75d218-0a83-4565-9db6-f9a9c5664c8d
Authorization: Bearer <access_token>
```

### Success Response

Status: `200 OK`

```json
{
  "id": "4b481533-1ef2-48e6-b1a5-8b1869863610",
  "customer_id": "6fa86d0b-322f-4325-8d23-7fc4fa9ec1a7",
  "items": [],
  "subtotal_vnd": 0
}
```

### Error Response

Status: `404 Not Found`

```json
{
  "message": "Sản phẩm trong giỏ hàng không tồn tại",
  "error": "Not Found",
  "statusCode": 404
}
```

## DELETE /api/v1/customer/cart

Xóa toàn bộ item trong giỏ hàng hiện tại.

Auth: Bearer token bắt buộc.

API giữ lại cart record và chỉ xóa `cart_items`.

### Request Example

```http
DELETE /api/v1/customer/cart
Authorization: Bearer <access_token>
```

### Success Response

Status: `200 OK`

```json
{
  "id": "4b481533-1ef2-48e6-b1a5-8b1869863610",
  "customer_id": "6fa86d0b-322f-4325-8d23-7fc4fa9ec1a7",
  "items": [],
  "subtotal_vnd": 0
}
```

## Validation Errors

Nếu body không hợp lệ, API trả lỗi `400 Bad Request` theo format validation của NestJS.

Ví dụ `quantity` không phải số dương:

```json
{
  "message": [
    "quantity must be a positive number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Unauthorized Response

Nếu thiếu token hoặc token không hợp lệ:

Status: `401 Unauthorized`

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

## Notes For Frontend

- Frontend nên gọi `GET /api/v1/customer/cart` sau khi user đăng nhập để đồng bộ cart.
- Khi bấm thêm món, gọi `POST /api/v1/customer/cart/items`.
- Khi đổi số lượng, gọi `PATCH /api/v1/customer/cart/items/:id`.
- Khi quantity về `0`, frontend nên gọi `DELETE /api/v1/customer/cart/items/:id` thay vì `PATCH quantity = 0`.
- API cart chưa tự checkout. Để đặt hàng, frontend có thể lấy `items` từ cart rồi gửi sang `POST /api/v1/customer/orders` theo format order hiện tại.
