import sql from 'mssql';
import { getConnection } from "../config/conectionStore.js";

export const agregarMaquina = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(500).json({
            success: false,
            message: "No hay conexión activa con SQL Server.",
        });
    }

    try {
        const { estado, tipo, modelo, marca } = req.body;

        await connection
            .request()
            .input("estado", sql.TinyInt, estado)
            .input("tipo", sql.NVarChar, tipo)
            .input("modelo", sql.NVarChar, modelo)
            .input("marca", sql.NVarChar, marca)
            .execute("agregar_maquina");

        return res.status(200).json({
            success: true,
            message: "Máquina agregada correctamente.",
        });
    } catch (error) {
        console.error("Error al agregar la máquina:", error);
        return res.status(500).json({
            success: false,
            message: "Error al agregar la máquina.",
        });
    }
}


export const nuevaRevisionMaquina = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(500).json({
            success: false,
            message: "No active SQL Server connection.",
        });
    }

    try {
        const { id_maquina, cedula_admin, nuevo_estado, observacion } = req.body;

        if(!id_maquina || !cedula_admin || !nuevo_estado || !observacion) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        await connection
            .request()
            .input("id_maquina", id_maquina)
            .input("cedula_admin", cedula_admin)
            .input("nuevo_estado", nuevo_estado)
            .input("observacion", observacion)
            .execute("revisar_maquina");

        return res.status(201).json({
            success: true,
            message: "Revision created successfully.",
        });
    } catch (error) {
        console.error("Error creating revision:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating revision.",
        });
    }
}