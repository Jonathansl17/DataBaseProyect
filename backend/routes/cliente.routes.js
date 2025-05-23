import { Router } from "express";
  import {
    insertarCliente,
    eliminarPersona,
    actualizarPersona,
    vistaClientes,
    vistaClientesClase,
    vistaClientesSesion,
    rankingClientes
  } from "../controllers/cliente.controller.js";

const router = Router()

router.get('/vistaClientes', vistaClientes)
router.get('/vistaClientesClase', vistaClientesClase)
router.get('/vistaClientesSesion', vistaClientesSesion)
router.get('/rankingClientes', rankingClientes)
router.post('/insertarCliente', insertarCliente)
router.put('/actualizarPersona', actualizarPersona)
router.delete('/eliminarPersona', eliminarPersona)


export default router