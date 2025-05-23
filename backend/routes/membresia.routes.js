import { Router } from "express";

import {
    renovar_membresia,
    clientesMembresiaVencida,
    registrarPagoMembresia
} from "../controllers/membresias.controller.js";

const router = Router();

router.get('/clientesMembresiaVencida', clientesMembresiaVencida);
router.put('/renovarMembresia', renovar_membresia);
router.post('/registrarPagoMembresia', registrarPagoMembresia);

export default router;