# Coupon Feature Testing Guide

This document guides you through testing the coupon functionality in the e-commerce API.

## Seller: Create a Coupon

**Request:**

```
POST /api/coupons
Content-Type: application/json
Authorization: Bearer SELLER_TOKEN

{
  "code": "SUMMER25",
  "discount": 25,
  "maxDiscount": 50,
  "minPurchase": 100,
  "expiresAt": "2023-12-31T23:59:59Z",
  "usageLimit": 100,
  "productSpecific": false
}
```

**Expected Response:**

```json
{
  "message": "Coupon created successfully",
  "coupon": {
    "id": 1,
    "code": "SUMMER25",
    "discount": 25,
    "maxDiscount": 50,
    "minPurchase": 100,
    "expiresAt": "2023-12-31T23:59:59.000Z",
    "isActive": true,
    "usageLimit": 100,
    "usageCount": 0,
    "sellerId": 1,
    "productSpecific": false,
    "products": [],
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
}
```

## Seller: Create a Product-Specific Coupon

**Request:**

```
POST /api/coupons
Content-Type: application/json
Authorization: Bearer SELLER_TOKEN

{
  "code": "GADGET10",
  "discount": 10,
  "maxDiscount": 30,
  "productSpecific": true,
  "products": [1, 2, 3]
}
```

**Expected Response:**

```json
{
  "message": "Coupon created successfully",
  "coupon": {
    "id": 2,
    "code": "GADGET10",
    "discount": 10,
    "maxDiscount": 30,
    "minPurchase": null,
    "expiresAt": null,
    "isActive": true,
    "usageLimit": null,
    "usageCount": 0,
    "sellerId": 1,
    "productSpecific": true,
    "products": [1, 2, 3],
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
}
```

## Seller: Get All Coupons

**Request:**

```
GET /api/coupons/seller
Authorization: Bearer SELLER_TOKEN
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "code": "SUMMER25",
    "discount": 25,
    "maxDiscount": 50,
    "minPurchase": 100,
    "expiresAt": "2023-12-31T23:59:59.000Z",
    "isActive": true,
    "usageLimit": 100,
    "usageCount": 0,
    "sellerId": 1,
    "productSpecific": false,
    "products": [],
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "code": "GADGET10",
    "discount": 10,
    "maxDiscount": 30,
    "minPurchase": null,
    "expiresAt": null,
    "isActive": true,
    "usageLimit": null,
    "usageCount": 0,
    "sellerId": 1,
    "productSpecific": true,
    "products": [1, 2, 3],
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
]
```

## Buyer: Validate a Coupon

**Request:**

```
POST /api/coupons/validate
Content-Type: application/json
Authorization: Bearer BUYER_TOKEN

{
  "code": "SUMMER25"
}
```

**Expected Response:**

```json
{
  "valid": true,
  "discount": 25,
  "discountAmount": 25.0,
  "originalTotal": 100.0,
  "finalTotal": 75.0,
  "productSpecific": false,
  "applicableProducts": []
}
```

## Buyer: Apply Coupon During Checkout

**Request:**

```
POST /api/orders/checkout
Content-Type: application/json
Authorization: Bearer BUYER_TOKEN

{
  "couponCode": "SUMMER25"
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
    "totalAmount": 75.0,
    "status": "completed",
    "couponCode": "SUMMER25",
    "discountAmount": 25.0,
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  "discountApplied": true,
  "discountAmount": 25.0,
  "originalTotal": 100.0,
  "finalTotal": 75.0
}
```

## Troubleshooting

1. **"Invalid coupon code"** - Make sure the coupon code exists and is typed correctly
2. **"This coupon has expired"** - Check that the expiration date hasn't passed
3. **"Minimum purchase amount required"** - Ensure your cart total meets the minimum required
4. **"This coupon has reached its usage limit"** - The coupon can no longer be used
5. **"This coupon is no longer active"** - The seller has deactivated this coupon
