import {
  BrowserRouter as Router, //define the router context
  Routes, //define all the possible routes in the application
  Route, //define single route and corresponding pages
} from "react-router-dom"; //handle the navigation in the application
import { AuthProvider } from "./data/authContext";
import { Pages } from "./data/constants";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import Register from "./pages/Register";
import CompletaProfilo from "./pages/CompleteProfile";
import Catalogo from "./pages/Catalogo";
import Contacts from "./pages/Contacts";
import Reviews from "./pages/Reviews";


function App() {
  return (
    <AuthProvider>
      {" "}
      {/*Wraps the application in the authentication context*/}
      <Router>
        {/* Wraps the application and defines the router that handles the navigation in the application */}{" "}
        <div>
          <Routes>
            {/* Define all the possible routes in the application */}
            <Route path={Pages.HOME} element={<Home />} />

            <Route path={Pages.LOGIN} element={<LoginPage />} />

            <Route path={Pages.ADMIN} element={<AdminPage />} />

            <Route path={Pages.CATALOG} element={<Catalogo />} />

            <Route path={Pages.REGISTER} element={<Register />} />

            <Route
              path={Pages.COMPLETE_PROFILE}
              element={<CompletaProfilo />}
            />

            <Route path={Pages.CONTACT} element={<Contacts />} />

            <Route
              path={Pages.REVIEWS}
              element={<Reviews />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
