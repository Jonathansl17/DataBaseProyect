import sql from 'mssql';
import { getConnection } from "../config/conectionStore.js";


export const asignarClase = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    const { cedula, id_clase } = req.body;

    if (!cedula || !id_clase) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios"
        });
    }

    try {
        await connection
            .request()
            .input("cedula", sql.Char(9), cedula)
            .input("id_clase", sql.Int, id_clase)
            .execute("asignar_clase_a_cliente");

        res.status(200).json({
            success: true,
            message: "Clase asignada correctamente"
        });
    } catch (err) {
        console.error("Error executing asignar_clase_a_cliente procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}



export const registarAsistencia = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    const { cedula, id_sesion_programada } = req.body;

    if (!cedula || !id_sesion_programada) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios"
        });
    }

    try {
        await connection
            .request()
            .input("cedula", sql.Char(9), cedula)
            .input("id_sesion_programada", sql.Int, id_sesion_programada)
            .execute("registrar_asistencia_cliente");

        res.status(200).json({
            success: true,
            message: "Asistencia registrada correctamente"
        });
    } catch (err) {
        console.error("Error executing registrar_asistencia_cliente procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}