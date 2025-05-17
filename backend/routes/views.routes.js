import { Router } from "express";

import { vistaClientes } from "../controllers/views.controller.js";

const router = Router()

router.get("/vista_clientes",vistaClientes)

export default router