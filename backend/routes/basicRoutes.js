import { Router } from "express";


import helloWorldController from "../controllers/basicController.js";

const router = Router();

router.get("/",helloWorldController);

export default router