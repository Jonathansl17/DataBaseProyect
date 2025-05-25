import Router from 'express';

import {
    agregarMaquina,
} from "../controllers/maquina.controller.js";

const router = Router();

router.post("/agregarMaquina", agregarMaquina);

export default router;