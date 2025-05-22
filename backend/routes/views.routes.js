import { Router } from "express";

import {
     vistaClientes,
     vista_clientes_clase
     } from "../controllers/views.controller.js";

const router = Router()

router.get("/vista_clientes",vistaClientes)
router.get("/vista_clientes_clase", vista_clientes_clase)

export default router