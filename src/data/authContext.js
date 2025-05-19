import { 
    createContext, 
    useState,
    useContext,
    useEffect 
} from "react";

const AuthContext = createContext(); //create a global context for the authentication that can be used in all the application

//wraps all the application, so that all the child components can access the context
export const AuthProvider = ({ children }) => {
    
    //state to check if the user is authenticated or not (if the token exists, set it to true)
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("jwt"));

    //state to check the role of the user (client or admin)
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    //useEffect to check if the user is authenticated or not during the load of the application
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const role = localStorage.getItem("role");

        if(token) {
            setIsAuthenticated(true);
            setRole(role);
        }
    }, []);

    //function to set the authentication state in the locale storage at login
    const login = (token, role = "user") => {
        localStorage.setItem("jwt", token);
        localStorage.setItem("role", role);
        setIsAuthenticated(true);
        setRole(role);
    };

    //reset the authentication state in the locale storage at logout
    const logout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); //custom hook to use the authentication context in the components