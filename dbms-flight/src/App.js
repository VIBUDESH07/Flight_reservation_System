
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Components/HomePage";
import Addflight from "./Components/Addflight";
import Login from "./Components/Login";
import Fetch from "./Components/Fetch";
import Appointment from "./Components/Appointment";

function App() {
  return (
   <div>

    <Routes>
      <Route path='/' element={<Layout/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/add' element={<Addflight/>}></Route>
      <Route path='/fetch' element={<Fetch/>}></Route>
      <Route path='/appointment/:id' element={<Appointment/>}></Route>
    </Routes>
   </div>
  );
}

export default App;
