/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The coupon ID
 *         code:
 *           type: string
 *           description: Coupon code
 *         discount:
 *           type: number
 *           description: Discount percentage (0-100)
 *         isActive:
 *           type: boolean
 *           description: Whether the coupon is active
 *         sellerId:
 *           type: integer
 *           description: ID of seller who created the coupon
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Coupon creation date
 *       example:
 *         id: 1
 *         code: "SUMMER25"
 *         discount: 25
 *         isActive: true
 *         sellerId: 1
 *         createdAt: "2023-06-01T12:00:00.000Z"
 *
 *     CreateCouponRequest:
 *       type: object
 *       required:
 *         - code
 *         - discount
 *       properties:
 *         code:
 *           type: string
 *           description: Coupon code
 *         discount:
 *           type: number
 *           description: Discount percentage (1-100)
 *       example:
 *         code: "SUMMER25"
 *         discount: 25
 *
 *     ValidateCouponRequest:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           description: Coupon code to validate
 *       example:
 *         code: "SUMMER25"
 *
 * /coupons:
 *   post:
 *     summary: Create a new coupon (Sellers only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCouponRequest'
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 coupon:
 *                   $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only sellers can create coupons
 *
 *   get:
 *     summary: Get all seller's coupons (Sellers only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller's coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - must be a seller
 *
 * /coupons/{id}/toggle:
 *   patch:
 *     summary: Toggle coupon active status (Sellers only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 coupon:
 *                   $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only the seller who created the coupon can modify it
 *       404:
 *         description: Coupon not found
 *
 * /coupons/{id}:
 *   delete:
 *     summary: Delete coupon (Sellers only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only the seller who created the coupon can delete it
 *       404:
 *         description: Coupon not found
 *
 * /coupons/validate:
 *   post:
 *     summary: Validate coupon code
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateCouponRequest'
 *     responses:
 *       200:
 *         description: Coupon validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 discount:
 *                   type: number
 *       400:
 *         description: Bad request or coupon not active
 *       404:
 *         description: Invalid coupon code
 */
