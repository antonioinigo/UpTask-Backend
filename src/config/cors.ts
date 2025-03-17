import { CorsOptions } from 'cors';

export const corsConfig = {
    origin: function (origin, callback) {
        console.log('Origin recibido:', origin); // Para depuración

        const whitelist = [
            process.env.FRONTEND_URL, 
            "http://localhost:5173" // Para desarrollo local
        ];

        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    },
    credentials: true, // Permite envío de cookies y encabezados como Authorization
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
};
