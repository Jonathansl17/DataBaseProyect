import { Router } from "express";
import { 
    insertar_cliente,
    eliminar_persona,
    actualizar_persona
  } from "../controllers/procedures.controller.js";

const router = Router()

router.post('/insertar_cliente', insertar_cliente)
router.put('/actualizar_persona', actualizar_persona)
router.delete('/eliminar_persona', eliminar_persona)


export default router