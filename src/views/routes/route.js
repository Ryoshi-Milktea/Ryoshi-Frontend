import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/landing-page/landingPage";
import Register from "../pages/register";
import Login from "../pages/login";
import Begin1 from "../pages/begin/begin1";
import ForgotPasswordOne from "../pages/forgot-password/forgot-password-1";
import ForgotPasswordTwo from "../pages/forgot-password/forgot-password-2";
import ForgotPasswordThree from "../pages/forgot-password/forgot-password-3";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPasswordOne />} />
      <Route path="/forgot-password-2" element={<ForgotPasswordTwo />} />
      <Route path="/forgot-password-3" element={<ForgotPasswordThree />} />
      <Route path="/begin_1" element={<Begin1 />} />
    </Routes>
  );
};

export default AllRoutes;
