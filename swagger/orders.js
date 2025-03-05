/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The order ID
 *         userId:
 *           type: integer
 *           description: The user ID
 *         items:
 *           type: string
 *           description: JSON string of order items
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *         status:
 *           type: string
 *           description: Order status
 *         couponCode:
 *           type: string
 *           nullable: true
 *           description: Applied coupon code
 *         discountAmount:
 *           type: number
 *           description: Discount amount applied
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation date
 *
 *     CheckoutRequest:
 *       type: object
 *       properties:
 *         couponCode:
 *           type: string
 *           description: Coupon code to apply
 *       example:
 *         couponCode: "SUMMER25"
 *
 * /orders/checkout:
 *   post:
 *     summary: Checkout cart and create order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 discountApplied:
 *                   type: boolean
 *                 discountAmount:
 *                   type: number
 *                 finalTotal:
 *                   type: number
 *       400:
 *         description: Bad request (cart empty, insufficient stock, etc.)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
