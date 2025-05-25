import Router from 'express';
import {
    vistaAdminMaquina

}from '../controllers/admin.controller.js';


const router = Router();

router.get('/vistaAdminMaquina', vistaAdminMaquina);

export default router;
