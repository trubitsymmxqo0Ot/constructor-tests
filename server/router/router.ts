import { Router } from "express";
import FormController from "../controller/controllers.ts";

const router = Router();

router.post('/register', FormController.register);
router.post('/login', FormController.login);
router.post('/logout', FormController.logout);
router.get('/refresh', FormController.refresh);

export default router;