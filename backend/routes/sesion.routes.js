import { Router } from "express";

import {
    crearSesion,
    inscribirClienteASesion,
    vistaSesiones,
    vistaDetallesSesion,
    cantidadSesionPorFecha,
    distribucionGeneroPorEstado,
    promedioPorGrupoYCupos
} from "../controllers/sesion.controller.js";
const router = Router();

router.get('/cantidadSesionPorFecha', cantidadSesionPorFecha);
router.get('/distribucionGeneroPorEstado', distribucionGeneroPorEstado);
router.get('/promedioPorGrupoYCupos', promedioPorGrupoYCupos);
router.get('/vistaDetallesSesion', vistaDetallesSesion);
router.get('/vistaSesiones', vistaSesiones);
router.post('/crearSesion', crearSesion);
router.post('/inscribirClienteASesion', inscribirClienteASesion);

export default router;
