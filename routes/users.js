// User service router
const express = require('express');
const router = express.Router();

const User = require('../lib/user');
const response = require('../lib/response.js');
const asyncHandler = require('../middleware/asyncHandler');
const routeProtection = require('../middleware/routeProtection');


// me - return current user
router.get('/me', routeProtection, asyncHandler( async (req, res, next) => {
    try{
        const {id} = req.session.user;
        const u = await User.findById(id);
        // only pull info from the first user found (there should not be mutiple btw)
        const {user_id, user_email, color} = u[0]
        const userInfo = {user_id, user_email, color}
        const r = response(200, 'User Found', userInfo);
        res.status(r.status).json(r);
    } catch (err) {
        next(err)
    }
}));

// User Crud Routes

// get all
router.get('/', routeProtection, asyncHandler( async (req, res, next) => {
    try {
        const result = await User.findAll()
        const r = response(200, 'success', result)
        res.status(r.status).json(r)
    } catch (err) {
        const r = response(err.status, err.message, [], err)
        res.status(r.status).json(r)
    }
}));

// get one by id
router.get('/:id', routeProtection,  asyncHandler( async (req, res, next) => {
    const {id} = req.params
    try{
        const result = await User.findById(id)
        const r = response(200, 'success', result)
        res.json(r)
    } catch (err) {
        const r = response(err.status, err.message, [], err)
        res.status(response.status).json(r)
    }
}));

//find one by field
router.get('/find/:field', routeProtection,  asyncHandler( async (req, res, next) => {
    const {field} = req.params
    const {value} = req.query
    try{
        const result = await User.find(field, value)
        const r = response(200, 'success', result)
        res.json(r)
    } catch (err) {
        const r = response(err.status, err.message, [], err)
        res.status(response.status).json(r)
    }
}));

// create one
router.post('/', asyncHandler ( async (req, res, next) => {
    try {
        const {user_email, password, token = ''} = req.body
        const result = await User.create({user_email, password, token})
        const r = response(201, null, result)
        res.status(r.status).json(r)
    } catch(err){
        const r = response(err.status, err.message, [], err)
        res.status(r.status).json(r)
    }
}));

// update one
router.patch('/:id', routeProtection, asyncHandler( async (req, res, next) => {
    const {id} = req.params
    const {password} = req.body
    try{
        const result = await User.findByIdAndUpdate(id, {"password": password})
        const r = response(202, 'updated successful', result)
        res.status(r.status).json(r)
    } catch (err) {
        const r = response(500, err.message, [], err)
        res.status(r.status).json(r)
    }
}));

// delete one
router.delete('/:id', routeProtection, asyncHandler( async (req, res, next) => {
    const {id} = req.params
    try {
        const result = await User.findByIdAndDelete(id)
        const r = response(200, 'Delete Successful', result)
        res.status(r.status).json(r)
    } catch (err) {
        console.log(err)
        const r = response(500, err.message, [], err)
        res.status(500).json(r)
    }
}));

// currently logged in user
router.get('/me', asyncHandler( async (req, res, next) => {
    const {id} = req.user
    try {
        const result = await User.findById(id)
        const r = response(200, 'success', result)
        res.status(r.status).json(r)
    } catch (err) {
        const r = response(err.status, err, [], err)
        res.status(r.status).json(r)
    }
}));


module.exports = router;

