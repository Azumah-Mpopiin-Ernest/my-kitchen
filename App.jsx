import Home from "./Home";
import SignUp from "./SignUp";
import Profile from "./Profile";
import { Routes, Route } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Profile" element={<Profile />} />
    </Routes>
  );
}
