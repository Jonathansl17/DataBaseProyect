import { Router } from "express";


import getDistritos from "../controllers/helper.controller.js";

const router = Router();

router.get("/distritos", getDistritos);

export default router