import { Router } from "express";

import {
    asignarClase,
    registarAsistencia
} from "../controllers/clase.controller.js";

const router = Router();

router.post('/registrarAsistencia', registarAsistencia);
router.post('/asignarClase', asignarClase);

export default router;