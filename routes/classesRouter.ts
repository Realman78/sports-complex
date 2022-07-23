import express from 'express'
const router = express.Router()
import Joi from 'joi'

import ejv from 'express-joi-validation'
const validator = ejv.createValidator({})

import { protect } from '../middleware/authMiddleware'
import { getClasses, getClass } from '../controllers/admin/adminController'
import { enrollUser, unenrollUser, rateClass } from '../controllers/class/classController'

router.use(protect)

const rateSchema = Joi.object({
    comment: Joi.string(),
    rating: Joi.number().max(5).min(1).required()
})

router.get('/', getClasses)
router.get('/:id', getClass)
router.patch('/enroll/:id', enrollUser)
router.patch('/unenroll/:id', unenrollUser)
router.patch('/rate/:id', validator.body(rateSchema), rateClass)

export default router