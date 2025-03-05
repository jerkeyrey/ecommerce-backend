# Testing User Profile and Balance Endpoints

## Prerequisites

1. Make sure your server is running: `npm run dev`
2. Have a registered user account
3. Have your authentication token ready

## Step 1: Login to Get Token

```
POST http://localhost:3000/api/auth/loginUser
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

Save the token from the response.

## Step 2: Test Profile Endpoint

```
GET http://localhost:3000/api/user/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

Expected response:

```json
{
  "id": 1,
  "email": "your-email@example.com",
  "role": "BUYER",
  "balance": 0
}
```

## Step 3: Add Funds

```
POST http://localhost:3000/api/user/add-funds
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "amount": 100.00
}
```

Expected response:

```json
{
  "message": "Funds added successfully",
  "user": {
    "id": 1,
    "email": "your-email@example.com",
    "balance": 100.0
  }
}
```

## Step 4: Check Balance

```
GET http://localhost:3000/api/user/balance
Authorization: Bearer YOUR_TOKEN_HERE
```

Expected response:

```json
{
  "balance": 100.0
}
```

## Troubleshooting

### Common Issues:

1. **401 Unauthorized Error**:

   - Make sure you're using a valid token
   - Ensure you're adding the "Bearer " prefix to your token
   - Check that token hasn't expired

2. **500 Server Error**:

   - Check server logs for detailed error messages
   - Ensure database connection is working
   - Verify that user ID in token exists in the database

3. **404 User Not Found**:
   - Make sure the user ID from your token matches a user in the database
