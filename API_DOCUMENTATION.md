# E-commerce API Documentation

This document provides detailed information about the endpoints, request/response formats, and authentication mechanisms of the E-commerce API.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Products](#products)
- [Cart](#cart)
- [Orders](#orders)
- [Coupons](#coupons)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token.

### Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Register User

Creates a new user account.

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "BUYER"  // Optional: "BUYER" or "SELLER", defaults to "BUYER"
}
```

**Response** (201 Created):

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "BUYER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

Authenticates a user and returns a JWT token.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "BUYER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Users

### Get User Profile

Returns the authenticated user's profile information.

```http
GET /user/profile
Authorization: Bearer YOUR_TOKEN
```

**Response** (200 OK):

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "BUYER",
  "balance": 100.0
}
```

### Get User Balance

Returns the authenticated user's balance.

```http
GET /user/balance
Authorization: Bearer YOUR_TOKEN
```

**Response** (200 OK):

```json
{
  "balance": 100.0
}
```

### Add Funds

Adds funds to the authenticated user's account balance.

```http
POST /user/add-funds
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "amount": 50.00
}
```

**Response** (200 OK):

```json
{
  "message": "Funds added successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "balance": 150.0
  }
}
```

## Products

### Create Product (Sellers Only)

Creates a new product listing.

```http
POST /products
Authorization: Bearer SELLER_TOKEN
Content-Type: application/json

{
  "name": "Smartphone X",
  "description": "Latest flagship smartphone with amazing features",
  "price": 799.99,
  "category": "Electronics",
  "stock": 50
}
```

**Response** (201 Created):

```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "Smartphone X",
    "description": "Latest flagship smartphone with amazing features",
    "price": 799.99,
    "category": "Electronics",
    "stock": 50,
    "inStock": true,
    "sellerId": 1
  }
}
```

### Get All Products

Returns a list of all available products.

```http
GET /products
```

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "name": "Smartphone X",
    "description": "Latest flagship smartphone with amazing features",
    "price": 799.99,
    "category": "Electronics",
    "stock": 50,
    "inStock": true,
    "sellerId": 1
  },
  {
    "id": 2,
    "name": "Laptop Pro",
    "description": "Powerful laptop for professionals",
    "price": 1299.99,
    "category": "Electronics",
    "stock": 25,
    "inStock": true,
    "sellerId": 1
  }
]
```

### Get Product by ID

Returns details for a specific product.

```http
GET /products/1
```

**Response** (200 OK):

```json
{
  "id": 1,
  "name": "Smartphone X",
  "description": "Latest flagship smartphone with amazing features",
  "price": 799.99,
  "category": "Electronics",
  "stock": 50,
  "inStock": true,
  "sellerId": 1
}
```

### Delete Product (Sellers Only)

Deletes a product. Only the seller who created the product can delete it.

```http
DELETE /products/1
Authorization: Bearer SELLER_TOKEN
```

**Response** (200 OK):

```json
{
  "message": "Product deleted successfully"
}
```

### Search Products

Search for products with various filters.

```http
GET /products/search?query=smartphone&category=Electronics&minPrice=500&maxPrice=1000&page=1&limit=10
```

**Response** (200 OK):

```json
{
  "totalProducts": 3,
  "totalPages": 1,
  "currentPage": 1,
  "products": [
    {
      "id": 1,
      "name": "Smartphone X",
      "description": "Latest flagship smartphone with amazing features",
      "price": 799.99,
      "category": "Electronics",
      "stock": 50,
      "inStock": true,
      "sellerId": 1
    },
    {
      "id": 3,
      "name": "Smartphone Y",
      "description": "Mid-range smartphone with great battery life",
      "price": 599.99,
      "category": "Electronics",
      "stock": 75,
      "inStock": true,
      "sellerId": 1
    }
  ]
}
```

## Cart

### Get Cart

Returns the authenticated user's shopping cart.

```http
GET /cart
Authorization: Bearer YOUR_TOKEN
```

**Response** (200 OK):

```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "cartId": 1,
      "productId": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "Smartphone X",
        "price": 799.99,
        "description": "Latest flagship smartphone with amazing features",
        "category": "Electronics",
        "stock": 50,
        "inStock": true,
        "sellerId": 1
      }
    }
  ],
  "total": 1599.98
}
```

### Add to Cart

Adds a product to the user's cart.

```http
POST /cart/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": 2,
  "quantity": 1
}
```

**Response** (201 Created):

```json
{
  "message": "Item added to cart",
  "cartItem": {
    "id": 2,
    "cartId": 1,
    "productId": 2,
    "quantity": 1,
    "product": {
      "id": 2,
      "name": "Laptop Pro",
      "price": 1299.99,
      "description": "Powerful laptop for professionals",
      "category": "Electronics",
      "stock": 25,
      "inStock": true,
      "sellerId": 1
    }
  }
}
```

### Update Cart Item

Updates the quantity of an item in the cart.

```http
PATCH /cart/update
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": 1,
  "quantity": 3
}
```

**Response** (200 OK):

```json
{
  "message": "Cart updated successfully",
  "cartItem": {
    "id": 1,
    "cartId": 1,
    "productId": 1,
    "quantity": 3,
    "product": {
      "id": 1,
      "name": "Smartphone X",
      "price": 799.99,
      "description": "Latest flagship smartphone with amazing features",
      "category": "Electronics",
      "stock": 50,
      "inStock": true,
      "sellerId": 1
    }
  }
}
```

### Remove from Cart

Removes an item from the cart.

```http
POST /cart/remove
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": 1
}
```

**Response** (200 OK):

```json
{
  "message": "Item removed from cart"
}
```

## Orders

### Checkout

Completes purchase of items in the cart and creates an order.

```http
POST /orders/checkout
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "couponCode": "SUMMER25"  // Optional
}
```

**Response** (201 Created):

```json
{
  "message": "Order placed successfully.",
  "order": {
    "id": 1,
    "userId": 1,
    "items": "[{\"id\":2,\"cartId\":1,\"productId\":2,\"quantity\":1,\"product\":{\"id\":2,\"name\":\"Laptop Pro\",\"price\":1299.99,\"description\":\"Powerful laptop for professionals\",\"category\":\"Electronics\",\"stock\":25,\"inStock\":true,\"sellerId\":1}}]",
    "totalAmount": 974.99,
    "status": "completed",
    "couponCode": "SUMMER25",
    "discountAmount": 325.0,
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  "discountApplied": true,
  "discountAmount": 325.0,
  "finalTotal": 974.99
}
```

## Coupons

### Create Coupon (Sellers Only)

Creates a new discount coupon.

```http
POST /coupons
Authorization: Bearer SELLER_TOKEN
Content-Type: application/json

{
  "code": "SUMMER25",
  "discount": 25
}
```

**Response** (201 Created):

```json
{
  "message": "Coupon created successfully",
  "coupon": {
    "id": 1,
    "code": "SUMMER25",
    "discount": 25,
    "isActive": true,
    "sellerId": 1,
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
}
```

### Get Seller Coupons (Sellers Only)

Returns all coupons created by the authenticated seller.

```http
GET /coupons
Authorization: Bearer SELLER_TOKEN
```

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "code": "SUMMER25",
    "discount": 25,
    "isActive": true,
    "sellerId": 1,
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "code": "WELCOME10",
    "discount": 10,
    "isActive": true,
    "sellerId": 1,
    "createdAt": "2023-06-02T12:00:00.000Z"
  }
]
```

### Toggle Coupon Status (Sellers Only)

Activates or deactivates a coupon.

```http
PATCH /coupons/1/toggle
Authorization: Bearer SELLER_TOKEN
```

**Response** (200 OK):

```json
{
  "message": "Coupon deactivated",
  "coupon": {
    "id": 1,
    "code": "SUMMER25",
    "discount": 25,
    "isActive": false,
    "sellerId": 1,
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
}
```

### Delete Coupon (Sellers Only)

Deletes a coupon.

```http
DELETE /coupons/2
Authorization: Bearer SELLER_TOKEN
```

**Response** (200 OK):

```json
{
  "message": "Coupon deleted successfully"
}
```

### Validate Coupon

Checks if a coupon code is valid.

```http
POST /coupons/validate
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "code": "SUMMER25"
}
```

**Response** (200 OK):

```json
{
  "valid": true,
  "discount": 25
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and consistent error responses:

### 400 Bad Request

```json
{
  "error": "Description of the error",
  "details": "Additional information" // Optional
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Error details" // In development mode only
}
```

## Data Models

### User

```prisma
model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  password String
  role     Role      @default(BUYER)
  balance  Float     @default(0.00)
  products Product[]
  carts    Cart[]
  orders   Order[]
  coupons  Coupon[]
}

enum Role {
  BUYER
  SELLER
}
```

### Product

```prisma
model Product {
  id          Int        @id @default(autoincrement())
  name        String
  description String
  price       Float
  category    String
  stock       Int        @default(0)
  inStock     Boolean    @default(true)
  sellerId    Int
  seller      User       @relation(fields: [sellerId], references: [id])
  CartItem    CartItem[]
}
```

### Cart and CartItem

```prisma
model Cart {
  id     Int        @id @default(autoincrement())
  userId Int
  user   User       @relation(fields: [userId], references: [id])
  items  CartItem[]

  @@unique([userId])
}

model CartItem {
  id        Int     @id @default(autoincrement())
  cartId    Int
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId Int
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int     @default(1)

  @@unique([cartId, productId])
}
```

### Order

```prisma
model Order {
  id            Int      @id @default(autoincrement())
  userId        Int
  user          User     @relation(fields: [userId], references: [id])
  items         Json
  totalAmount   Float
  status        String   @default("pending")
  createdAt     DateTime @default(now())
  couponCode    String?
  discountAmount Float    @default(0)
}
```

### Coupon

```prisma
model Coupon {
  id        Int      @id @default(autoincrement())
  code      String   @unique
  discount  Float
  isActive  Boolean  @default(true)
  sellerId  Int
  seller    User     @relation(fields: [sellerId], references: [id])
  createdAt DateTime @default(now())
}
```

## Database Setup Instructions

### Setting Up PostgreSQL

#### Windows:

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/).
2. During installation, set a password for the postgres user.
3. Open pgAdmin (should be installed with PostgreSQL).
4. Create a new database named 'ecommerce'.
5. Update your `.env` file with the connection string:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ecommerce"
   ```

#### macOS:

1. Install PostgreSQL with Homebrew: `brew install postgresql`
2. Start PostgreSQL: `brew services start postgresql`
3. Create a new database: `createdb ecommerce`
4. Update your `.env` file with the connection string:
   ```
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/ecommerce"
   ```

#### Linux (Ubuntu/Debian):

1. Install PostgreSQL: `sudo apt install postgresql postgresql-contrib`
2. Start PostgreSQL: `sudo service postgresql start`
3. Switch to postgres user: `sudo -i -u postgres`
4. Access PostgreSQL prompt: `psql`
5. Create a new database: `CREATE DATABASE ecommerce;`
6. Create a new user: `CREATE USER youruser WITH ENCRYPTED PASSWORD 'yourpassword';`
7. Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE ecommerce TO youruser;`
8. Update your `.env` file with the connection string:
   ```
   DATABASE_URL="postgresql://youruser:yourpassword@localhost:5432/ecommerce"
   ```

### Setting up Prisma

After configuring PostgreSQL and updating your `.env` file:

1. Apply migrations:

   ```bash
   npx prisma migrate dev
   ```

2. If you need to check your database structure:

   ```bash
   npx prisma studio
   ```

   This opens a web interface at http://localhost:5555 to browse your database.

3. To reset your database (caution - this deletes all data):
   ```bash
   npx prisma migrate reset
   ```

## Support

For questions or issues related to this API documentation, please open an issue in the GitHub repository.
