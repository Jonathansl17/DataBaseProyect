import { Router } from "express";


import {
    getDistritos,
    getClases
}

from "../controllers/helper.controller.js";

const router = Router();

router.get("/distritos", getDistritos);
router.get("/clases", getClases);

export default router