import Router from 'express';

import{
    asignarEntrenadorASesionProgramada,
    vistaClienteSesionEntrenador
} from '../controllers/entrenador.controller.js';

const router = Router();

router.get('/vistaClienteSesionEntrenador', vistaClienteSesionEntrenador)
router.post('/asignarEntrenadorASesionProgramada', asignarEntrenadorASesionProgramada);

export default router