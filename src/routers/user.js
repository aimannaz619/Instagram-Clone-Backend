const express = require('express')

const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
        // res.status(201).send({ user })

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
        // res.send({ user })

    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})






module.exports = router