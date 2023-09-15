import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID  from "../helpers/generarID.js";


const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null, //no es obligatorio
        trim: true,
    },
    web:{
        type: String,
        default: null
    },
    token:{
        type:String,
        default: generarID() //funcion generada en la carpeta helpers para crear TOKENs aleatorios
    },
    confirmado:{ //para que confirmen la cuenta
        type: Boolean,
        default: false
    }

});

//4.- Encripato de claves de veterinario
    veterinarioSchema.pre('save', async function(next){ // Antes de que se guarde un registro se hashea (encripta)
    
   if(!this.isModified("password")) { // para que si el password ya esta encriptado no lo vuelva a encriptar.
    next();                          // next() salta a la siguiente linea.
   }
    const salt = await bcrypt.genSalt(10); //numero de ciclos para encriptar
    this.password = await bcrypt.hash(this.password, salt); //aqui meto el password del usuario y lo encripto.
} )

//5.- Para autenticar password, el almacenado ecrypato y el que introduce el usuario:
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password); //compara el password que introduce en el formulario con el que tenemos
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);//lo registro como modelo
export default Veterinario;