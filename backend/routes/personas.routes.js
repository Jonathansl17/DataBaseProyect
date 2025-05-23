import { Router } from "express";
  import {
    insertarCliente,
    eliminarPersona,
    actualizarPersona,
    vistaClientes,
    vistaClientesClase,
    vistaClientesSesion,
    rankingClientes,
    promedioPorGrupoYCupos,
    distribucionGeneroPorEstado,
    cantidadSesionPorFecha
  } from "../controllers/personas.controller.js";

const router = Router()

router.get('/vistaClientes', vistaClientes)
router.get('/vistaClientesClase', vistaClientesClase)
router.get('/vistaClientesSesion', vistaClientesSesion)
router.get('/rankingClientes', rankingClientes)
router.get('/promedioPorGrupoYCupos', promedioPorGrupoYCupos)
router.get('/distribucionGeneroPorEstado', distribucionGeneroPorEstado)
router.get('/cantidadSesionPorFecha', cantidadSesionPorFecha)
router.post('/insertarCliente', insertarCliente)
router.put('/actualizarPersona', actualizarPersona)
router.delete('/eliminarPersona', eliminarPersona)


export default router