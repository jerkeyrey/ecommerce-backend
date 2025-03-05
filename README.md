# E-commerce Backend API

A comprehensive RESTful API for e-commerce applications built with Node.js, Express, and PostgreSQL/Prisma.

![API Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Features

- **User Authentication**: JWT-based authentication with role-based access control (Buyer/Seller)
- **Product Management**: Create, list, search, and filter products with inventory tracking
- **Shopping Cart**: Complete cart functionality with stock validation
- **Order Processing**: Checkout flow with balance management and inventory updates
- **Coupon System**: Create and apply discount coupons
- **API Documentation**: Swagger UI for interactive API testing

## 📘 API Documentation

### Swagger Interactive Documentation

Explore and test the API using the interactive Swagger UI:

```
http://localhost:3000/api-docs
```

Once the server is running, open the URL above in your browser to:

- Browse all available endpoints
- View request/response schemas
- Test API calls directly from your browser
- Authenticate with JWT for secured endpoints

For detailed documentation, see also [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🚀 Tech Stack

- **Node.js & Express**: Fast, unopinionated web framework
- **PostgreSQL**: Robust relational database
- **Prisma ORM**: Type-safe database client
- **JSON Web Tokens**: Secure authentication
- **bcryptjs**: Password hashing
- **Swagger**: API documentation and testing
- **ESM Modules**: Modern JavaScript with ES modules

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16.x or higher)
- PostgreSQL (v14.x or higher)
- npm or yarn

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd ecommerce_backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up the database

1. Start your PostgreSQL server

2. Create a new database:

   ```sql
   CREATE DATABASE ecommerce;
   ```

3. Configure environment variables by creating a `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
   JWT_SECRET="your-secret-key-here"
   PORT=3000
   ```
   Replace `username` and `password` with your PostgreSQL credentials.

### Step 4: Run database migrations

```bash
npx prisma migrate dev
```

This command will:

- Create all database tables based on the Prisma schema
- Generate the Prisma client

### Step 5: (Optional) Seed the database with initial data

```bash
npm run seed
```

### Step 6: Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📊 Database Schema

The application uses the following data models:

- **User**: Authentication and user information

  - Roles: BUYER or SELLER
  - Balance for making purchases

- **Product**: Product listings created by sellers

  - Name, description, price, category, stock
  - Connected to seller (User)

- **Cart** and **CartItem**: User's shopping cart

  - Each CartItem links to a Product and quantity

- **Order**: Completed purchases

  - JSON representation of ordered items
  - Connection to user, discounts, status

- **Coupon**: Discount codes created by sellers
  - Percentage-based discounts
  - Can be activated/deactivated

## 🔑 API Authentication

Most endpoints require authentication via JWT token.

### Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
```

To get a token:

1. Register a new user or login with existing credentials
2. Use the returned token in the Authorization header

## 🛣️ API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user

  - Body: `{ "email": "user@example.com", "password": "securepass123", "role": "BUYER" }`

- `POST /api/auth/login`: Authenticate and get token
  - Body: `{ "email": "user@example.com", "password": "securepass123" }`

### Users

- `GET /api/user/profile`: Get user profile
- `GET /api/user/balance`: Get user balance
- `POST /api/user/add-funds`: Add funds to user balance
  - Body: `{ "amount": 100.00 }`

### Products

- `GET /api/products`: List all products
- `GET /api/products/:id`: Get product details
- `POST /api/products`: Create a new product (Sellers only)
  - Body: `{ "name": "Product", "description": "...", "price": 29.99, "category": "Electronics", "stock": 100 }`
- `DELETE /api/products/:id`: Delete a product (Seller only)
- `GET /api/products/search?query=keyword&category=Electronics&minPrice=10&maxPrice=100`: Search products

### Cart

- `GET /api/cart`: Get user's cart
- `POST /api/cart/add`: Add item to cart
  - Body: `{ "productId": 1, "quantity": 2 }`
- `PATCH /api/cart/update`: Update cart item
  - Body: `{ "productId": 1, "quantity": 3 }`
- `POST /api/cart/remove`: Remove item from cart
  - Body: `{ "productId": 1 }`

### Orders

- `POST /api/orders/checkout`: Checkout cart and create order
  - Body: `{ "couponCode": "SUMMER25" }` (optional)

### Coupons

- `POST /api/coupons`: Create coupon (Sellers only)
  - Body: `{ "code": "SUMMER25", "discount": 25 }`
- `GET /api/coupons`: List seller's coupons
- `PATCH /api/coupons/:id/toggle`: Toggle coupon active status
- `DELETE /api/coupons/:id`: Delete a coupon
- `POST /api/coupons/validate`: Validate a coupon code
  - Body: `{ "code": "SUMMER25" }`

## 📘 Interactive API Documentation

You can explore and test the API interactively using Swagger UI:

```
http://localhost:3000/api-docs
```

This interface allows you to:

- See all available endpoints
- View request/response schemas
- Test endpoints directly from the browser
- Authenticate with your JWT token

#### Buyer Flow:

1. Register/Login as a buyer
2. Add funds to your account
3. Browse/search products
4. Add items to cart
5. Apply coupon (optional)
6. Checkout

#### Seller Flow:

1. Register/Login as a seller
2. Create products
3. Create discount coupons
4. View your product catalog

## 🛠️ Development

### Running Tests

```bash
npm test
```

### Code Formatting

```bash
npm run format
```

### Database Management

Reset the database (⚠️ This will delete all data):

```bash
npx prisma migrate reset
```

Generate Prisma client after schema changes:

```bash
npx prisma generate
```

## 🔄 Error Handling

All API endpoints use consistent error responses:

- **400** Bad Request: Invalid input data
- **401** Unauthorized: Missing or invalid authentication
- **403** Forbidden: Insufficient permissions
- **404** Not Found: Resource doesn't exist
- **500** Server Error: Unexpected server error

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
