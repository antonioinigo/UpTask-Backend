import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        console.log('Origin recibido:', origin); // Log para depurar
        const whitelist = [process.env.FRONTEND_URL];

        if (process.argv[2] === '--api') {
            whitelist.push(undefined);
        }

        if (!origin || whitelist.includes(origin)) {
            callback(null, true); // Permitir el origen
        } else {
            callback(new Error('Error de CORS'));
        }
    }
};