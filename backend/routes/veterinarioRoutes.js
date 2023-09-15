import express from 'express'
const router = express.Router();
import {registrar,
    perfil, 
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
} from "../controllers/veterinarioController.js"
import checkAuth from '../middleware/authMiddleware.js'; //MIDDLEWARE lo usamos para entrar en las zonas autenticadas previamente

//Rutas:
//Sin loguear (area pública):
router.post('/', registrar); //post porque envio datos al servidor
router.get('/confirmar/:token', confirmar);//ruta para confirmar el usuario a traves del token (/:token es xq es dinamico)
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);//para recuperar contraseña

router.get('/olvide-password/:token', comprobarToken)//vamos a tener un token que el usuario lo va a leer desde la URL
router.post('/olvide-password/:token', nuevoPassword)//vamos a almacenar el nuevo password

/* router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword) */;//ES LO MISMO QUE LAS LINEAS DE ARRIBA COMENTADAS

//Debe autenticar:(area privada)
router.get('/perfil',checkAuth, perfil); //una vez que visito esta ruta va a la funcion checkAuth y comprueba y pasa a la siguiente que es perfil


export default router;