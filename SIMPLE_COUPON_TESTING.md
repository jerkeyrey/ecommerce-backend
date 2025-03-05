# Simple Coupon Feature Testing Guide

This guide shows you how to test the simplified coupon functionality in the e-commerce API.

## Seller: Create a Coupon

**Request:**

```
POST /api/coupons
Content-Type: application/json
Authorization: Bearer SELLER_TOKEN

{
  "code": "SAVE20",
  "discount": 20
}
```

**Expected Response:**

```json
{
  "message": "Coupon created successfully",
  "coupon": {
    "id": 1,
    "code": "SAVE20",
    "discount": 20,
    "isActive": true,
    "sellerId": 1,
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
}
```

## Seller: View All Coupons

**Request:**

```
GET /api/coupons
Authorization: Bearer SELLER_TOKEN
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "code": "SAVE20",
    "discount": 20,
    "isActive": true,
    "sellerId": 1,
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
]
```

## Seller: Toggle Coupon Status (Activate/Deactivate)

**Request:**

```
PATCH /api/coupons/1/toggle
Authorization: Bearer SELLER_TOKEN
```

**Expected Response:**

```json
{
  "message": "Coupon deactivated",
  "coupon": {
    "id": 1,
    "code": "SAVE20",
    "discount": 20,
    "isActive": false,
    "sellerId": 1,
    "createdAt": "2023-06-01T12:00:00.000Z"
  }
}
```

## Buyer: Validate a Coupon

**Request:**

```
POST /api/coupons/validate
Content-Type: application/json
Authorization: Bearer BUYER_TOKEN

{
  "code": "SAVE20"
}
```

**Expected Response:**

```json
{
  "valid": true,
  "discount": 20
}
```

## Buyer: Apply Coupon During Checkout

**Request:**

```
POST /api/orders/checkout
Content-Type: application/json
Authorization: Bearer BUYER_TOKEN

{
  "couponCode": "SAVE20"
}
```

**Expected Response:**

```json
{
  "message": "Order placed successfully.",
  "order": {
    "id": 1,
    "userId": 2,
    "items": "[...]",
    "totalAmount": 80.0,
    "status": "completed",
    "couponCode": "SAVE20",
    "discountAmount": 20.0,
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  "discountApplied": true,
  "discountAmount": 20.0,
  "finalTotal": 80.0
}
```

## Common Errors and Troubleshooting

1. **"Invalid coupon code"**: Make sure the coupon exists and is typed correctly
2. **"This coupon is no longer active"**: The seller has deactivated this coupon
3. **"Access denied"**: Only sellers can create/manage coupons
