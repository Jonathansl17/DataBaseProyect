import { getConnection } from "../config/conectionStore.js";

export const vistaClientes = async(req,res) =>{
    const {connection} = getConnection()

    if(!connection){
        return res.status(400).json({
            success:false,
            message:"No active Sql server connection"
        })
    }

    try{
        const result = await connection.
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

export const vista_clientes_clase = async(req,res) =>{
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