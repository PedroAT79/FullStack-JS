import jwt from "jsonwebtoken"
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) =>{
  let token;  
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    console.log('Si tiene el token con bearer');
  try {
    token = req.headers.authorization.split(' ')[1]; //aqui estoy asignando a la variable token la parte despues de "Bearer 23423422343"
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //metodo de JWT para comprobar el token que recibe con el que tenemo en .env
    console.log(decoded);
    
    req.Veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");//para que no se traiga los datos sensibles se le pone la parte de select()
    console.log("req vet: " +  Veterinario.id); //req.veterinario es para que cree una sesion con ese bojeto veterinario
    return next();//se va al siguiente middleware y no a las siguientes lineas

} catch (error) {
    const e = new Error('Token no valido');
    return res.status(403).json({msg:e.message});
  }
}
  if(!token){ //si no hay token se ejecuta este código
    const error = new Error('Token no valido o inexistente');
    res.status(403).json({msg:error.message});
  }

  next(); //cdo se ejecuta el codigo ejecuta la funcion pero si expiro el token  pasa al siguiente middleware
}

export default checkAuth;