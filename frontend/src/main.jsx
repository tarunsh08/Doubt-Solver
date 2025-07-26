import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/check-auth.jsx";
import Tickets from "./pages/tickets.jsx";
import TicketDetailsPage from "./pages/ticket.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Admin from "./pages/admin.jsx";
import Navbar from "./components/navbar.jsx";
// import ThemeToggleButton from "@components/ui/theme-toggle-button"
import { ThemeProvider } from "./components/ui/theme-provider"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar/>}/>
        <Route path="/" element={<CheckAuth protectedRoute={true}><Tickets /></CheckAuth>}/>
        <Route path="/tickets/:id" element={<CheckAuth protectedRoute={true}><TicketDetailsPage /></CheckAuth>}/>
        <Route path="/login" element={<CheckAuth protectedRoute={false}><Login /></CheckAuth>}/>
        <Route path="/signup" element={<CheckAuth protectedRoute={false}><Signup /></CheckAuth>}/>
        <Route path="/admin" element={<CheckAuth protectedRoute={true}><Admin /></CheckAuth>}/>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);