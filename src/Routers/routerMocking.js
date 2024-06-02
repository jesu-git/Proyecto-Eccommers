import { Router } from "express";
import { ControllerMocking } from "../controllers/controllers-mocking.js";


export const router = Router()

router.get('/', ControllerMocking.mocking) 
router.get('/winston', ControllerMocking.winston) 