//Para generar el token del usuario de VETERINARIO:
const generarID = () =>{
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

export default generarID;