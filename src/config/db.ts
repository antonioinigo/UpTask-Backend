import mongoose from "mongoose";
import colors from "colors";
import {exit} from 'node:process';

export const connectDB= async ()=>{
    try {
       const connection = await mongoose.connect(process.env.DATABASE_URL);
       const url = `${connection.connections[0].host}:${connection.connections[0].port}`
       console.log(colors.bgGreen.white(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        console.log( colors.red.bold('Error al conectar a MongoDB') )
        exit(1);
        
    }
}

