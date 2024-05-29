
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Components/HomePage";
import Addflight from "./Components/Addflight";

function App() {
  return (
   <div>

    <Routes>
      <Route path='/' element={<Layout/>}></Route>
      <Route path='/add' element={<Addflight/>}></Route>
    </Routes>
   </div>
  );
}

export default App;
