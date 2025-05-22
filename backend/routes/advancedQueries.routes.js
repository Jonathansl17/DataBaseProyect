import { Router } from "express";

import {
    ranking_clientes,
    clientes_membresia_vencida,
    promedio_por_grupo_y_cupos,
    distribuciondegenero_porEstado,
    cantidad_sesion_por_fecha
} from "../controllers/advancedQueries.controller.js";

const router = Router();

router.get("/ranking_clientes", ranking_clientes);
router.get("/clientes_membresia_vencida", clientes_membresia_vencida);
router.get("/promedio_por_grupo_y_cupos", promedio_por_grupo_y_cupos);
router.get("/distribucion_de_genero_por_estado", distribuciondegenero_porEstado);
router.get("/cantidad_sesion_por_fecha", cantidad_sesion_por_fecha);

export default router;