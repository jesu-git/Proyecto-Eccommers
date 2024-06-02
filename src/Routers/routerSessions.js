import { Router } from "express"
import passport from "passport"
import { ControllerSession } from "../controllers/controller-sessions.js"

export const router = Router()



router.post('/registro',passport.authenticate('registro',{failureRedirect:'/api/session/errorRegistro'}),ControllerSession.sessionRegistro)
router.get('/errorRegistro',ControllerSession.errorRegistro)
router.get('/errorLogin',ControllerSession.errorLogin)
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/errorLogin' }), ControllerSession.login)
router.get('/logout', ControllerSession.logout)
router.get('/github', passport.authenticate('github', {}),ControllerSession.github)
router.get('/callbackgithub', passport.authenticate('github', { failureRedirect: '/api/session/errorGithub' }), ControllerSession.callbackgithub)
router.get('/errorGithub', ControllerSession.errorGithub)
router.get('/current', ControllerSession.current) 