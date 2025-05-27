import { Router } from "express";


import {
    getDistritos,
    getClases,
    getAsistencia,
    getTipoMembresia,
    getCliente,
    getEntrenadores
} from "../controllers/helper.controller.js";

const router = Router();

router.get("/distritos", getDistritos);
router.get("/clases", getClases);
router.get("/asistencia", getAsistencia);
router.get("/tipoMembresia", getTipoMembresia);
router.get("/cliente/:cedula", getCliente);
router.get("/entrenadores", getEntrenadores);

export default router