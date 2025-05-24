import { Router } from "express";


import {
    getDistritos,
    getClases,
    getAsistencia,
    getTipoMembresia
} from "../controllers/helper.controller.js";

const router = Router();

router.get("/distritos", getDistritos);
router.get("/clases", getClases);
router.get("/asistencia", getAsistencia);
router.get("/tipoMembresia", getTipoMembresia);

export default router