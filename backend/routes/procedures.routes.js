import { Router } from "express";
import { insertar_cliente } from "../controllers/procedures.controller.js";
import { eliminar_persona } from "../controllers/procedures.controller.js";

const router = Router()

router.post('/insertar_cliente', insertar_cliente)
router.delete('/eliminar_persona', eliminar_persona)

export default router