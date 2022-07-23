import express from 'express'
const router = express.Router()
import _Joi from 'joi'
import JoiDate from '@joi/date'
const Joi: any = _Joi.extend(JoiDate)

import ejv from 'express-joi-validation'
const validator = ejv.createValidator({})

import { errorHandler, postLogin, postRegister, verifyUser, resendConfirmationMail, resetPassword } from '../controllers/auth/authControllers'
import { protect } from '../middleware/authMiddleware'

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(24).required(),
    password: Joi.string().min(8).max(48).required(),
    mail: Joi.string().email().required(),
    birthdate: Joi.date().format('YYYY-MM-DD').raw().required(),
})
const loginSchema = Joi.object({
    mail: Joi.string().required(),
    password: Joi.string().min(8).max(48).required(),
})

router.post('/register', validator.body(registerSchema), postRegister)
router.post('/login', validator.body(loginSchema), postLogin)
router.get('/confirm/:code', verifyUser)
router.get('/confirm/resend/:id', resendConfirmationMail)
router.patch('/reset', protect, resetPassword)


router.get('/*', errorHandler)


export default router