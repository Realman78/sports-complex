import express from 'express'
const router = express.Router()

import Joi from 'joi'

import ejv from 'express-joi-validation'
const validator = ejv.createValidator({})

import { postClass, getClasses, getClass, updateClass, deleteClass, updateClassTermins, addClassTermin, updateEnrolledUsers, addEnrolledUser } from '../controllers/admin/adminController'

const classSchema = Joi.object({
    sport: Joi.string().valid('baseball', 'basketball', 'football', 'boxing', 'cycling', 'fitness', 'golf', 'running', 'swimming', 'tennis', 'triathlon', 'volleyball').required(),
    seniority: Joi.string().valid('Children', 'Youth', 'Young Adults', 'Adults').required(),
    description: Joi.string().required(),
    duration: Joi.string().required(),
})
const addTerminSchema = Joi.object({
    termin: Joi.date().required(),
})
const addEnrolledUserSchema = Joi.object({
    userId: Joi.string().required(),
})

const updateEnrolledSchema = Joi.object({
    users: Joi.alternatives().try(Joi.string(), Joi.array().max(10)),
})


router.get('/', getClasses)
router.get('/:id', getClass)
router.post('/', validator.body(classSchema), postClass)
router.put('/update/:id', validator.body(classSchema), updateClass)
router.delete('/delete/:id', deleteClass)
router.patch('/termins/update/:id', updateClassTermins)
router.patch('/termins/add/:id', validator.body(addTerminSchema), addClassTermin)
router.patch('/enrolled/update/:id', validator.body(updateEnrolledSchema), updateEnrolledUsers)
router.patch('/enrolled/add/:id', validator.body(addEnrolledUserSchema), addEnrolledUser)


export default router