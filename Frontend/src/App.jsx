
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthLayout from './layout/AuthLayout'
import Login from './paginas/Login'
import ConfirmarCuenta from './paginas/ConfirmarCuenta'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'

function App() {

  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element = {<AuthLayout/>}>
          <Route index  element = {<Login/>}/>
          <Route path = "registrar"  element = {<Registrar/>}/>
          <Route path = "confirmar/:id"  element = {<ConfirmarCuenta/>}/>
          <Route path = "OlvidePassword"  element = {<OlvidePassword/>}/>
      </Route>
      
    </Routes>
   
   </BrowserRouter>
  )
  }
export default App
