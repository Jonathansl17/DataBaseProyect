import { Router } from "express";

import {
    cantidadSesionPorFecha,
    distribucionGeneroPorEstado,
    promedioPorGrupoYCupos
} from "../controllers/sesion.controller.js";
const router = Router();

router.get('/cantidadSesionPorFecha', cantidadSesionPorFecha);
router.get('/distribucionGeneroPorEstado', distribucionGeneroPorEstado);
router.get('/promedioPorGrupoYCupos', promedioPorGrupoYCupos);

export default router;
