import express from 'express' // en packaje.com metemos el type:modules
import dotenv from 'dotenv'
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express(); //aqui tenemos todo lo que necesitamos para el servidor.
dotenv.configDotenv(); //aqui busco la variable de entorno con la clave que esta en .env oara ocultarla clave.


conectarDB();

app.use(express.json()) //para habilitar los datos que recibo de tipo POST

app.use('/api/veterinarios', veterinarioRoutes); //manejo del routing
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000 //Creo una variable que aplique el puerto 4000 si no existe la variable de entorno

app.listen(PORT, () => {
   console.log(`Servidor funcionando en el puerto ${PORT}`); 
});