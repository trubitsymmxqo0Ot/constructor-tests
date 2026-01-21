import { Router } from "express";
import FormController from "../controller/controllers.ts";
import {body} from 'express-validator';

const router = Router();

router.post('/register', 
  body('email').isEmail(),
  body('password').isLength({min: 5, max: 32}),
   FormController.register);
router.post('/login', FormController.login);
router.post('/logout', FormController.logout);
router.get('/refresh', FormController.refresh);

export default router;