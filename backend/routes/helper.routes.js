import { Router } from "express";


import {
    getDistritos,
    getClases,
    getAsistencia
}

from "../controllers/helper.controller.js";

const router = Router();

router.get("/distritos", getDistritos);
router.get("/clases", getClases);
router.get("/asistencia", getAsistencia);

export default router