import Paciente from "../models/Paciente.js";

//Alta de Pacientes:
const agregarPaciente = async (req, res) => {

const paciente = new Paciente(req.body); //Me genera el paciente con la informacio nque le hemos pasado por el formulario POST
paciente.veterinario = req.Veterinario.id;
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
//console.log("req.params.id: " + req.params.id);//req.params.id saco el id del veterinario que esta logado
//console.log("req.nombre: " + req.nombre); //
const { id } = req.params;//saco el id del paciente como variable
//console.log("id: " + id);

const paciente = await Paciente.findById(id);//le pido que me guarde en una variable el paciente del id que le estoy pidiendo
//console.log("paciente: " + paciente);

//console.log("veterinario del paciente: " + paciente.veterinario._id);
//console.log("id del veterinario logado: " + req.Veterinario._id);

if(!paciente){ //si no existe el paciente que le hemos pasado:
    return res.status(404).json({msg:"No encontrado"})
}


if(paciente.veterinario._id.toString() !== req.Veterinario._id.toString()) { //comprobAR que el paciente es del veterinario que le corresponde
    return res.json({msg: "Accion no valida, el paciente no corresponde al veterinario autenticado"});
}

if(paciente){ //si existe y corresponde al veterinario logado me lo responde con el valor:
    res.json(paciente);
}else{
    
}
};

//Editar paciente:
const actualizarPaciente = async (req, res) =>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg:"No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.Veterinario._id.toString()){
        return res.json({msg: "Accion no valida, no se puede editar el paciente, no corresponde al veterinario autenticado"});
    }

        //Actualizar paciente:
        paciente.nombre = req.body.nombre || paciente.nombre; // le doy al nombre del paciente el valor a traves del body o si no se lo doy el que ya tiene
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fechaAlta = req.body.fechaAlta || paciente.fechaAlta;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;
        try {
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado);
        } catch (error) {
            console.log(error);
        }
}

//Eliminar paciente:
const eliminarPaciente = async (req, res) =>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    console.log(paciente);
    if(!paciente){
        return res.status(404).json({msg:"No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.Veterinario._id.toString()){
        return res.json({msg: "Accion no valida, no se puede editar el paciente, no corresponde al veterinario autenticado"});
    }

    try {
        await paciente.deleteOne();
        res.json ({msg:'Paciente eliminado' + 'id Paciente: ' + paciente._id});
        res.json(pacienteActualizado);
        } catch (error) {
            console.log(error);
        }

}


export {agregarPaciente, 
        obtenerPacientes,
        obtenerPaciente,
        actualizarPaciente,
        eliminarPaciente};