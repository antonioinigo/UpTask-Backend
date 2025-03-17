import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL, 'https://up-task-frontend-nu-eight.vercel.app'];

    // Permitir solicitudes sin origen (usado por herramientas como Postman)
    if (process.argv[2] === '--api') {
      whitelist.push(undefined);
    }

    // Verificar si la solicitud proviene de un origen permitido
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS'));
    }
  },
};
