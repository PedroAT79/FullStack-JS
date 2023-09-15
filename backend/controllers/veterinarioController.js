import Veterinario from "../models/Veterinario.js" 
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req,res) => {
    console.log(req.body); // Cuando le mandamos algo desde un post a express lo guarda en el request.body
                            //Asi sale por la consola undefined, xq hay que habilitarlo primero en el index con app.use(express.json).

//2.-Prevenir usuario duplicados:
   const {email} = req.body;//saco el email del usuario que intento registrar con el POST
   const existeUsuario = await Veterinario.findOne({email:email})//busca por los atributos de cada registro de la bbdd
    if(existeUsuario){
        const error = new Error('Error: El email de usuario ya registrado');
        return res.status(400).json({msg: error.message}); //para que no ejecute las siguientes lineas en caso de que exista el usuario
                                                          //con esta ultima linea ya no envia el error a la consola.
    }
    try {
        //1.-Guardar un nuevo veterinario:
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save(); //lo guardo en la bbdd
        res.json({veterinarioGuardado}); //lo que mando como respuesta y lo que veo en POSTMAN cdo me devuelve la misma

    } catch (error) {
        console.log(error)
    }
}


const perfil = (req, res) => {
    console.log(req.Veterinario); //esto me lo traigo de authMiddleware
    const {Veterinario} = req;
    res.json({perfil:Veterinario}); //Asi me traigo la informacion de la sesion del Veterinario en cuestion que esta autnticado
};

//3.-Confirmar usuario con Token
const confirmar = async (req, res) => {
   /*  console.log(req.params.token) */ //para leer el parametro dinamico .params.nombreDinamico
   const {token} = req.params // saco el token de lo que le envio desde el POST

   const usuarioConfirmar = await Veterinario.findOne({token:token});

   if(!usuarioConfirmar){ //en caso de no existir ese token envia el error:
    const error = new Error('Token no valido');
    return res.status(404).json({msg:error.message});
   }
   //Aqui borro el token una vez usado para confirmar y paso el parametro confirmado a true en la bbdd
   try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({msg:'Usario confirmado correctamente'});
   } catch (error) {
        console.log(error); //si hay algun error llego aqui
   }

   console.log(usuarioConfirmar); //saco el veterinario por consola para comprobar.

};

//5.- Autenticar usuario (veterinario):
const autenticar = async (req, res) => {
    //5.1.- Que la cuenta exista.(comprobacion de que el usuario existe a traves de su email)
    const {email, password} = req.body; 
    const usuario = await Veterinario.findOne({email:email}); //me lo busca por el email
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(403).json({msg:error.message});
    }
    //5.2.- Que la cuenta este confirmada
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg:error.message});
    }
    //5.3.- Revisar password escrito:
    if(await usuario.comprobarPassword(password)){
        //5.3.1 Autenticar:
        res.json({token:generarJWT(usuario.id)}); //con esto saco el JWT token
    }else {
        const error = new Error("Password incorrecto");
        return res.status(403).json({msg:error.message});
    }
 }

//6.-Recuperar contraseñas: 
//Funcion para comprobar si el usuario que ponen para recuperar contraseña existe
const olvidePassword = async (req,res) =>{
    const {email} = req.body;

    const existeVeterinario = await Veterinario.findOne({email:email});
    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        res.status(400).json({msg:error.message})
    }

    try {
        existeVeterinario.token =  generarID ();//con esta funcion genero el token, la creé anteriormente y la he importado.
        await existeVeterinario.save();//guardo el veterinario con el nuevoToken
        res.json({msg:"Hemos enviado un email con las instrucciones."});

    } catch (error) {
        console.log(error);
    }
}
//6.1
const comprobarToken = async (req,res) => {
    const {token} = req.params;//para recoger lo que me envian por la url
    
    const tokenValido = await Veterinario.findOne({token:token});
    if(tokenValido){
        //El token es valido el usuario existe:
        res.json({msg:'Token valido, el usuario existe'});
    }else {
        const error = new Error('Token no válido');
        res.status(400).json({msg:error.message});
    }
    
}
//Almacenar nueva clave(password) generada:
const nuevoPassword = async (req,res) =>{
    const {token} = req.params; //token que se genera (params -- url)
    const {password} = req.body; //nuevo password del usuario (lo que el usuario escribe body)

    const veterinario = await Veterinario.findOne({token:token});
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg:error.message});
    }

    try {
        veterinario.token = null; //al comprobar que hay un veterinario con ese token, el token lo paso a null
        veterinario.password = password; // y meto en nuevo password que envio desde el formulario
        await veterinario.save(); //guardo con las nueva clave
        return res.json({msg:"Password cambiado satisfactoriamente"})
        
    } catch (error) {
        console.log(error);
        
    }
}

export {registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword}