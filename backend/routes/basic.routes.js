import { Router } from "express";


import helloWorldController from "../controllers/basic.controller.js";

const router = Router();

router.get("/",helloWorldController);

export default router