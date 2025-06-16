import { 
    createContext, 
    useState,
    useContext,
    useEffect 
} from "react";
import { Pages, Role } from "../data/constants";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(); //create a global context for the authentication that can be used in all the application

//wraps all the application, so that all the child components can access the context
export const AuthProvider = ({ children }) => {
    // State to hold the JWT token
    const [authToken, setAuthToken] = useState(localStorage.getItem("jwt"));

    //state to check if the user is authenticated or not (if the token exists, set it to true)
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("jwt"));

    //state to check the role of the user (client or admin)
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    //useEffect to check if the user is authenticated or not during the load of the application
    // This useEffect will now also initialize authToken from localStorage
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const storedRole = localStorage.getItem("role"); // Use a different name to avoid conflict with state setter

        if(token) {
            setAuthToken(token); // Set the authToken state
            setIsAuthenticated(true);
            setRole(storedRole || ""); // Ensure role is not null
        } else {
            // Clear states if token is not found on load
            setAuthToken(null);
            setIsAuthenticated(false);
            setRole("");
        }
    }, []);

    //function to set the authentication state in the locale storage at login
    const login = (token, userRole = Role.USER) => { // Use userRole to avoid conflict
        localStorage.setItem("jwt", token);
        localStorage.setItem("role", userRole);
        setAuthToken(token); // Update authToken state
        setIsAuthenticated(true);
        setRole(userRole);
    };

    //reset the authentication state in the locale storage at logout
    const logout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        setAuthToken(null); // Clear authToken state
        setIsAuthenticated(false);
        setRole(null); // Set role to null on logout
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout, authToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); //custom hook to use the authentication context in the components