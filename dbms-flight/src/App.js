import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Components/HomePage";
import Addflight from "./Components/Addflight";
import Login from "./Components/Login";
import Fetch from "./Components/Fetch";
import Appointment from "./Components/Appointment";
import ErrorPage from "./Components/Error";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* Default route */}
          <Route path="login" element={<Login />} />
          <Route path="add" element={<Addflight />} />
          <Route path="fetch" element={<Fetch />} />
          <Route path="appointment/:id" element={<Appointment />} />
          <Route path="*" element={<ErrorPage />} /> {/* Catch-all route for 404 */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
