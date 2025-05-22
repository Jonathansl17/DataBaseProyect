import { Router } from "express";

import {
     vistaClientes,
     vista_clientes_clase,
     vista_clientes_sesion
     } from "../controllers/views.controller.js";

const router = Router()

router.get("/vista_clientes",vistaClientes)
router.get("/vista_clientes_clase", vista_clientes_clase)
router.get("/vista_clientes_sesion", vista_clientes_sesion)

export default router