import {
  BrowserRouter as Router, //define the router context
  Routes, //define all the possible routes in the application
  Route, //define single route and corresponding pages
} from "react-router-dom"; //handle the navigation in the application
import { AuthProvider } from "./data/authContext";
import { Pages } from "./data/constants";

import MainLayout from "./components/MainLayout/MainLayout"; // Main layout that includes TopBar and Footer
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import Register from "./pages/Register";
import CompletaProfilo from "./pages/CompleteProfile";
import Catalogo from "./pages/Catalogo";
import Contacts from "./pages/Contacts";
import Reviews from "./pages/Reviews";
import ClientDashboard from "./pages/ClientDashboard";
import ProductDetailPage from "./pages/ProductDetails";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/*Wraps the application in the authentication context*/}
      <Router>
        {/* Wraps the application and defines the router that handles the navigation in the application */}{" "}
        <div>
          <Routes>
            <Route
              path={Pages.COMPLETE_PROFILE}
              element={<CompletaProfilo />}
            />
            <Route path={Pages.LOGIN} element={<LoginPage />} />
            <Route
              path={Pages.COMPLETE_PROFILE}
              element={<CompletaProfilo />}
            />

            {/* Routes that DO have TopBar - Wrapped by MainLayout */}
            <Route element={<MainLayout />}>
              {" "}
              {/* <--- MainLayout wraps these routes */}
              <Route path={Pages.HOME} element={<Home />} />
              <Route path={Pages.ADMIN} element={<AdminPage />} />
              <Route path={Pages.CATALOG} element={<Catalogo />} />
              <Route path={Pages.REGISTER} element={<Register />} />
              <Route path={Pages.CONTACT} element={<Contacts />} />
              <Route path={Pages.REVIEWS} element={<Reviews />} />
              <Route
                path={Pages.CLIENT_DASHBOARD}
                element={<ClientDashboard />}
              />
              <Route
                path={Pages.CATALOG_PRODUCT}
                element={<ProductDetailPage />}
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
