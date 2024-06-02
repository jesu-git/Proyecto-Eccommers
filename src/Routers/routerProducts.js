

import { Router } from 'express'
import { ControllerProduct } from '../controllers/controller-product.js'
import { authRol } from '../middlewares/checkRol.js'
import { premiumAuth } from '../middlewares/authPremium.js'

export const router = Router()


router.get('/', ControllerProduct.getProductHome)
router.get('/:id',ControllerProduct.getProductId)
router.post('/', ControllerProduct.createProduct)
router.put('/:id',premiumAuth(),authRol(["admin","premium"]),ControllerProduct.updateProduct)
router.delete("/:id",premiumAuth(),authRol(["admin","premium"]), ControllerProduct.deleteProduct)