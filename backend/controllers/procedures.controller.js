import sql from 'mssql';
import { getConnection } from "../config/conectionStore.js";


export const insertar_cliente = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    const {
        cedula,
        nombre,
        apellido1,
        apellido2,
        genero,
        distrito,
        correo,
        fecha_nacimiento,
        edad,
    } = req.body;

    if (!cedula || !nombre || !apellido1 || !genero || !distrito || !correo || !fecha_nacimiento || !edad) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios"
        });
    }

    try {
        const result = await connection
            .request()
            .input("cedula", sql.Char(9), cedula)
            .input("nombre", sql.VarChar(20), nombre)
            .input("apellido1", sql.VarChar(20), apellido1)
            .input("apellido2", sql.VarChar(20), apellido2)
            .input("genero", sql.TinyInt, genero)
            .input("distrito", sql.SmallInt, distrito)
            .input("correo", sql.VarChar(50), correo)
            .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
            .input("edad", sql.TinyInt, edad)
            .execute("insertar_cliente");

        res.status(200).json({
            success: true,
            message: "Cliente insertado correctamente"
        });
    } catch (err) {
        console.error("Error executing insertar_cliente procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


export const eliminar_persona = async(req,res)=>{
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({
            success: false,
            message: "La cedula es obligatoria"
        });
    }

    try {
        const result = await connection
            .request()
            .input("cedula", sql.Char(9), cedula)
            .execute("eliminar_persona");

        res.status(200).json({
            success: true,
            message: "Cliente eliminado correctamente"
        });
    } catch (err) {
        console.error("Error executing eliminar_persona procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}