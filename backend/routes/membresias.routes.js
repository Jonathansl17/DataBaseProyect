import { Router } from "express";

import {
    renovar_membresia,
    clientesMembresiaVencida
} from "../controllers/membresias.controller.js";

const router = Router();

router.get('/clientesMembresiaVencida', clientesMembresiaVencida);
router.put('/renovarMembresia', renovar_membresia);


export default router;