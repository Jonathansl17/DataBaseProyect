import sql from 'mssql';
import { getConnection } from "../config/conectionStore.js";


export const insertarCliente = async (req, res) => {
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
        await connection
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


export const actualizarPersona = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    const {
        cedula,
        correo,
        telefono
    } = req.body;

    if (!cedula || !correo || !telefono) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios"
        });
    }

    try {
        await connection
            .request()
            .input("cedula", sql.Char(9), cedula)
            .input("correo", sql.VarChar(50), correo)
            .input("telefono", sql.VarChar(8), telefono)
            .execute("actualizar_persona");

        res.status(200).json({
            success: true,
            message: "Cliente actualizado correctamente"
        });
    } catch (err) {
        console.error("Error executing actualizar_persona procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}


export const eliminarPersona = async(req,res)=>{
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
        await connection
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


export const vistaClientes = async(req,res) =>{
    const {connection} = getConnection()

    if(!connection){
        return res.status(400).json({
            success:false,
            message:"No active Sql server connection"
        })
    }

    try{
        await connection.
        request().query("SELECT * FROM vista_clientes");
        console.log(result)
        res.json({
            success:true,
            tables:[result.recordset]
        })
    }catch(err){
        console.error("Error executing vista_clientes procedure: ", err);
        res.status(400).json({
            success:false,
            message: err.message
        })
        
    }
}

export const vistaClientesClase = async(req,res) =>{
    const {connection} = getConnection()

    if(!connection){
        return res.status(400).json({
            success:false,
            message:"No active Sql server connection"
        })
    }

    try{
        const result = await connection.
        request().query("SELECT * FROM vista_clientes_clase");
        console.log(result)
        res.json({
            success:true,
            tables:[result.recordset]
        })
    }catch(err){
        console.error("Error executing vista_clientes_clase procedure: ", err);
        res.status(400).json({
            success:false,
            message: err.message
        })
        
    }
}

export const vistaClientesSesion = async(req,res) =>{
    const {connection} = getConnection()

    if(!connection){
        return res.status(400).json({
            success:false,
            message:"No active Sql server connection"
        })
    }

    try{
        const result = await connection.
        request().query("SELECT * FROM vista_clientes_sesion");
        console.log(result)
        res.json({
            success:true,
            tables:[result.recordset]
        })
    }catch(err){
        console.error("Error executing vista_clientes_sesion procedure: ", err);
        res.status(400).json({
            success:false,
            message: err.message
        })
        
    }
}


export const rankingClientes = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active Sql server connection"
        });
    }

    try {
        const result = await connection
            .request()
            .query(`
                SELECT 
                    p.cedula,
                    p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_completo,
                    COUNT(cc.id_clase) AS total_clases,
                    RANK() OVER (ORDER BY COUNT(cc.id_clase) DESC) AS posicion
                FROM cliente_clase cc
                JOIN persona p ON cc.cedula = p.cedula
                GROUP BY p.cedula, p.nombre, p.apellido1, p.apellido2;
                `);
        console.log(result);
        res.json({
            success: true,
            tables: [result.recordset]
        });
    } catch (err) {
        console.error("Error executing consulta_avanzada1 procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}



export const promedioPorGrupoYCupos = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active Sql server connection"
        });
    }

    try {
        const result = await connection
            .request()
            .query(`
                SELECT 
                    numero_grupo,
                    cupo_disponible,
                    cantidad_matriculados,
                    CASE 
                        WHEN cantidad_matriculados > cupo_disponible THEN 'Sobrecupo'
                        WHEN cantidad_matriculados = cupo_disponible THEN 'Lleno'
                        ELSE 'Disponible'
                    END AS estado
                FROM grupo;

                `);
        console.log(result);
        res.json({
            success: true,
            tables: [result.recordset]
        });
    } catch (err) {
        console.error("Error executing consulta_avanzada1 procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const distribucionGeneroPorEstado = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active Sql server connection"
        });
    }

    try {
        const result = await connection
            .request()
            .query(`
                    SELECT 
                        ec.estado,
                        SUM(CASE WHEN g.genero = 'Masculino' THEN 1 ELSE 0 END) AS hombres,
                        SUM(CASE WHEN g.genero = 'Femenino' THEN 1 ELSE 0 END) AS mujeres,
                        COUNT(*) AS total
                    FROM cliente c
                    JOIN persona p ON c.cedula = p.cedula
                    JOIN generos g ON p.genero = g.id_genero
                    JOIN estados_clientes ec ON c.estado = ec.id_estado
                    GROUP BY ec.estado;
                `);
        console.log(result);
        res.json({
            success: true,
            tables: [result.recordset]
        });
    } catch (err) {
        console.error("Error executing consulta_avanzada1 procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const cantidadSesionPorFecha = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active Sql server connection"
        });
    }

    try {
        const result = await connection
            .request()
            .query(`
                    SELECT 
                        c.nombre AS clase,
                        sp.fecha AS fecha_sesion,
                        COUNT(*) AS total_sesiones_en_fecha
                    FROM sesion s
                    JOIN clase c ON s.id_clase = c.id_clase
                    JOIN sesion_programada sp ON s.id_sesion = sp.id_sesion
                    GROUP BY c.nombre, sp.fecha
                    ORDER BY c.nombre, sp.fecha;
                `);
        console.log(result);
        res.json({
            success: true,
            tables: [result.recordset]
        });
    } catch (err) {
        console.error("Error executing consulta_avanzada1 procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}