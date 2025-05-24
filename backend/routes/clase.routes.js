import { Router } from "express";

import {
    crearClase,
    asignarClase,
    registarAsistencia
} from "../controllers/clase.controller.js";

const router = Router();

router.post('/registrarAsistencia', registarAsistencia);
router.post('/asignarClase', asignarClase);
router.post('/crearClase', crearClase);

export default router;