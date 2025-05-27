import { Router } from "express";

import {
    crearSesion,
    inscribirClienteASesion,
    vistaSesiones,
    vistaDetallesSesion,
    cantidadSesionPorMes,
    distribucionGeneroPorEstado,
    promedioPorGrupoYCupos,
    cursorSesionesSinEntrenador
} from "../controllers/sesion.controller.js";
const router = Router();

router.get('/cantidadSesionPorMes', cantidadSesionPorMes);
router.get('/distribucionGeneroPorEstado', distribucionGeneroPorEstado);
router.get('/promedioPorGrupoYCupos', promedioPorGrupoYCupos);
router.get('/vistaDetallesSesion', vistaDetallesSesion);
router.get('/cursorSesionesSinEntrenador', cursorSesionesSinEntrenador);
router.get('/vistaSesiones', vistaSesiones);
router.post('/crearSesion', crearSesion);
router.post('/inscribirClienteASesion', inscribirClienteASesion);

export default router;
