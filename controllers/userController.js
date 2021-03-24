const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const User = require('../models/user')
const Result = require('../models/Result')


async function sendConfirmationEmail(email, link) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tenentepedroso@gmail.com',
          pass: 'miva2016'
        }
    })

    let h1 = '<h1>Confirme sua inscrição</h1>'
    let p = `<p>Clique aqui para confirmar http://localhost:3000\/user/confirm/${link}</p>`

    let html = h1 + p

    const mailOptions = {
        from: 'tenentepedroso@gmail.com',
        to: email,
        subject: 'Confirmation Email',
        html: html
    }
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error)
        }
    })
}

async function generateLink () {
    let a = Date.now()
    let b = Math.random()
    return result = a.toString() + b.toString()
}

router.post('/register', async (req, res, next) => {
  const {userEmail, userPassword}  = req.body

  try {
        if (await User.findOne({ userEmail })) {
            return res.json({ error: true, message: 'User already exists'})
        }
            
        let link = await generateLink()

        const user = await User.create({ link : link, email: userEmail, password: userPassword})

        //   await sendConfirmationEmail(user.email, user.link)

        res.json({ userId: 0, userEmail: user.email, userPassword: user.password })

  } catch (err) {

    let response = new Result(true, "", err.message)

    return res.json(response)
    }
})

router.post('/login', async(req, res) => {

    const { email, password } = req.body

    try {
        // Try to get the user and bring its hashed password to be checked.
        const user = await User.findOne({ email }).select('+password')

        if (!user) return res.json({ error: true, message: 'User does not exists'})

        // if (!user.checked) return res.json({ error: true, message: 'User has not yet checked its account'})

        if (!await bcrypt.compare(password, user.password))
        	return res.json({ error: true, message : "Invalid password" })

        user.password = undefined

        let response = new Result(false, user)

        return res.json(response)

    } catch (err) {

        let response = new Result(true, "", err.message)

        return res.json(response)
    }

  })

  router.get('/find/:email', async(req, res) => {

    const { email } = req.params
  
    try {
        // Try to get the user
        const user = await User.findOne({ email })

        if (!user)return res.json({ error: true, message: 'User does not exists'})
       
        let response = new Result(false, user)

        return res.json(response)

    } catch (err) {
        let response = new Result(true, "", err.message)

        return res.json(response)
    }

  })

  router.get('/confirm/:link', async(req, res) => {

    const { link } = req.params
  
    try {
        // Try to get the user
        let user = await User.findOne({ link })

        if (!user)
            return res.json({ error: true, message: 'User does not exists'})

        user.checked = true
        user.link = ""
        userSaved = await user.updateOne(user)

        return res.json({
            error: false,
            message: 'Conta confirmada',
            user: user
        })

    } catch (err) {
        console.log(err)
        return res.json(err.message)
    }

  })

module.exports = router