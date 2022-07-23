import express from 'express'
const router = express.Router()

import adminAuthRouter from './adminAuthRouter'
import adminClassRouter from './adminClassRouter'
import { protect, manageAccess } from '../middleware/authMiddleware'

router.use(protect)
router.use(manageAccess)

router.use('/auth', adminAuthRouter)
router.use('/classes', adminClassRouter)

export default router