import express from "express";
const router = express.Router()
import asyncHandler from "express-async-handler";
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public

router.post('/login',asyncHandler( async (req, res)=>{
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
}))

// @desc Register a new user
// @route POST /api/users
// @access Public

router.post('/',asyncHandler( async (req, res)=>{
    const { name, email, password } = req.body

    const userExist = await User.findOne({ email })

    if(userExist){
       res.status(400)
       throw new Error('user already exists')
    } 

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
}))

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private

router.put('/profile', protect, asyncHandler( async (req, res)=>{

    const user = await User.findById(req.user._id)

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
        
    } else {
        res.status(404)
        throw new Error('User not found')
    }

}))

// @desc Get user Details
// @route GET /api/users/profile
// @access Private

router.get('/profile', protect, asyncHandler( async (req, res)=>{

    const user = await User.findById(req.user._id)

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
        
    } else {
        res.status(404)
        throw new Error('User not found')
    }

}))

// @desc Get all users
// @route GET /api/users
// @access Private/Admin

router.get('/', protect, admin, asyncHandler( async (req, res)=>{

    const users = await User.find({})
    res.json(users)

}))

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin

router.delete('/:id', protect, admin, asyncHandler( async (req, res)=>{

    const user = await User.findById(req.params.id)
    if(user){   
        await user.remove()
        res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }

}))

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin

router.get('/:id', protect, admin, asyncHandler( async (req, res)=>{

    const user = await User.findById(req.params.id).select('-password')
    if(user) { 
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }

}))

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin

router.put('/:id', protect, asyncHandler( async (req, res)=>{

    const user = await User.findById(req.params.id)

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
        
    } else {
        res.status(404)
        throw new Error('User not found')
    }

}))

export default router