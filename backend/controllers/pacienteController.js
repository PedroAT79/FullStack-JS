import Paciente from "../models/Paciente.js";

//Alta de Pacientes:
const agregarPaciente = async (req, res) => {

const paciente = new Paciente(req.body); //Me genera el paciente con la informacio nque le hemos pasado por el formulario POST
paciente.veterinario = req.Veterinario._id;
console.log(paciente);
try {
    //console.log(req.Veterinario._id); //para que solo saque el id del veterinario que se ha autenticado previmanete para introducir al paciente
    const pacienteAlmacenado = await paciente.save();
    res.json({msg:pacienteAlmacenado});
} catch (error) {
    console.log(error);
}
}
//Listar pacientes:
const obtenerPacientes = async (req,res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.Veterinario);
    res.json({pacientes});
}


//Obtener paciente:
const obtenerPaciente = async (req, res) =>{
console.log(req.params.id);
const { id } = req.params;
const paciente = await Paciente.findById(id);
console.log(paciente);
if(paciente.veterinario._id.toString() !== req.Veterinario._id.toString()){
   console.log('Veterinario del paciente que quiero ver: ' + paciente.veterinario._id.toString());
   console.log('Veterinario que esta autenticado: ' + req.Veterinario._id.toString());
   //return res.json({msg:'Autenticacion no valida'});
}
/* if(paciente){
    res.json(paciente);
} */
};

//Editar paciente:
const actualizarPaciente = async (req, res) =>{


}

//Eliminar paciente:
const eliminarPaciente = async (req, res) =>{


}


export {agregarPaciente, 
        obtenerPacientes,
        obtenerPaciente,
        actualizarPaciente,
        eliminarPaciente};