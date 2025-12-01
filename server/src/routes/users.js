import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getMe, updateMe, changePassword, getMyStats } from '../controllers/userController.js'

const router = Router()

router.get('/me', authenticate, getMe)
router.put('/me', authenticate, updateMe)
router.put('/me/password', authenticate, changePassword)
router.get('/me/stats', authenticate, getMyStats)

export default router
