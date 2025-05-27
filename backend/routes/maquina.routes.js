import Router from 'express';

import {
    agregarMaquina,
    nuevaRevisionMaquina
} from "../controllers/maquina.controller.js";

const router = Router();

router.post("/agregarMaquina", agregarMaquina);
router.post('/nuevaRevisionMaquina', nuevaRevisionMaquina);

export default router;