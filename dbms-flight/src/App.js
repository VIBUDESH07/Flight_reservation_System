import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Components/HomePage";
import Addflight from "./Components/Addflight";
import Login from "./Components/Login";
import Fetch from "./Components/Fetch";
import Appointment from "./Components/Appointment";
import ErrorPage from "./Components/Error";
import PassengerDetails from "./Components/PassengerDetails";
import AdminPage from "./Components/AdminPage";
import UpdateFlight from "./Components/UpdateFlight";
import SignUp from "./Components/SignUp";
import Sidebar from "./Components/Sidebar"; // Correct import path
import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="add" element={<ProtectedRoute element={Addflight} requiredRole="admin" />} />
          <Route path="fetch" element={<Fetch />} />
          <Route path="passenger" element={<PassengerDetails />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="appointment/:id" element={<Appointment />} />
          <Route path="update-flight/:id" element={<ProtectedRoute element={UpdateFlight} requiredRole="admin" />} />
          <Route path="admin" element={<ProtectedRoute element={AdminPage} requiredRole="admin" />} />
          <Route path="home" element={<Sidebar />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
