import {
  BrowserRouter as Router, //define the router context
  Routes, //define all the possible routes in the application
  Route, //define single route and corresponding pages
} from "react-router-dom"; //handle the navigation in the application

import LoginPage from "./pages/LoginPage"; //import the login page
import Home from "./pages/Home"; //import the home page
import { AuthProvider } from "./data/authContext";
import TopBar from "./components/TopBar";
import Catalogo from "./pages/Catalogo";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/*Wraps the application in the authentication context*/}
      <TopBar /> {/* Renders the top bar component */}
      <Router>
        {/* Wraps the application and defines the router that handles the navigation in the application */}{" "}
        <div>
          <Routes>
            {/* Define all the possible routes in the application */}{" "}
            {/* Contains all the routes*/}
            <Route path="/" element={<Catalogo />} />
            <Route path="/login" element={<LoginPage />} />
            {/*
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/products" element={<ProductsCatalog />} />
            <Route path="/register" element={<Register />} />
            <Route path="/completa-profilo" element={<CompletaProfilo />} />
            */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
