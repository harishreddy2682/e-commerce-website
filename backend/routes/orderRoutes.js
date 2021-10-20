import asyncHandler from 'express-async-handler'
import express from 'express'
const router = express.Router()
import Order from '../models/orderModel.js'
import { admin, protect } from '../middleware/authMiddleware.js'

// @desc Create new orders
// @route POST /api/orders
// @access Private

router.post('/', protect, asyncHandler( async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if(orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('No order items')
    } else {
        const order = new Order({ orderItems, user: req.user._id, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }

    
} ))

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin

router.get('/', protect, admin, asyncHandler( async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
} ))

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private

router.get('/myorders', protect, asyncHandler( async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
} ))

// @desc Get order by ID
// @route GET /api/orders/:ID
// @access Private

router.get('/:id', protect, asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order){
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not Found')
    }
    
} ))

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private

router.put('/:id/pay', protect, asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id)

    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not Found')
    }
    
} ))

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin

router.put('/:id/deliver', protect, admin, asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id)

    if(order){
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not Found')
    }
    
} ))



export default router