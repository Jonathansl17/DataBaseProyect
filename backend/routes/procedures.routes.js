import { Router } from "express";
import { insertar_cliente } from "../controllers/procedures.controller.js";

const router = Router()

router.post('/insertar_cliente', insertar_cliente)

export default router