import express from 'express';
const router = express.Router();
import { agregarPaciente,
        obtenerPacientes,
        obtenerPaciente,
        actualizarPaciente,
        eliminarPaciente } from '../controllers/pacienteController.js';
import checkAuth  from '../middleware/authMiddleware.js'; //para poder dar de alta y ver los pacientes una vez que el veterinario este autenticado


router.route('/')
.post(checkAuth, agregarPaciente)
.get(checkAuth, obtenerPacientes);//en el post le estoy diciendo que el usuario que quiere dar de alta o ver los pacientes necesita tener una cuenta y estar autenticado y lo hacemos metiendo el middleware
                                  //con el chekAuth estabamos guardando en la variable interna de express req.Veterinario
router.route('/:id') 
.get(checkAuth, obtenerPaciente)
.put(checkAuth, actualizarPaciente)
.delete(checkAuth, eliminarPaciente)


export default router;