import express from 'express'
const router = express.Router()

import _Joi from 'joi'
import JoiDate from '@joi/date'
const Joi: any = _Joi.extend(JoiDate)

import ejv from 'express-joi-validation'
const validator = ejv.createValidator({})

import { postRegister } from '../controllers/auth/authControllers'
import { getUsers, getUser, updateUser, updateEnrolledClasses, updateStatus, deleteUser } from '../controllers/admin/adminController'

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(24).required(),
    password: Joi.string().min(8).max(48).required(),
    mail: Joi.string().email().required(),
    birthdate: Joi.date().format('YYYY-MM-DD').raw().required(),
    role: Joi.string().valid('USER', 'ADMIN', '', null)
})
const updateSchema = Joi.object({
    username: Joi.string().min(3).max(24).required(),
    mail: Joi.string().email().required(),
    birthdate: Joi.date().format('YYYY-MM-DD').raw().required(),
    role: Joi.string().valid('USER', 'ADMIN')
})
const updateEnrolledSchema = Joi.object({
    enrolledClasses: Joi.array(),
})
const updateStatusSchema = Joi.object({
    status: Joi.string().valid('Active', 'Pending').required(),
})

router.post('/register', validator.body(registerSchema), postRegister)
router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/update/:id', validator.body(updateSchema), updateUser)
router.patch('/enrolled/update/:id', validator.body(updateEnrolledSchema), updateEnrolledClasses)
router.patch('/status/update/:id', validator.body(updateStatusSchema), updateStatus)
router.delete('/delete/:id', deleteUser)

export default router