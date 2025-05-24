import { getConnection } from "../config/conectionStore.js";


export const getDistritos = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    try {
        const result = await connection.request().query("SELECT * FROM distritos");
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error executing get_distritos procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}


export const getClases = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    try {
        const result = await connection.request().query("SELECT * FROM clase");
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error executing get_clases procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const getAsistencia = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    try {
        const result = await connection.request().query("SELECT * FROM asistencia_cliente");
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error executing get_asistencia procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const getTipoMembresia = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    try {
        const result = await connection.request().query("SELECT * FROM tipo_membresia");
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error executing get_tipo_membresia procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}