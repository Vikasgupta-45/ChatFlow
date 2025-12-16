import { createContext, useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
if (!axios.defaults.baseURL) {
    axios.defaults.baseURL = "http://localhost:3000";
}
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loadingUser, setLoadingUser] = useState(false);

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/users/profile", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
            if (data.success) {
                setUser(data.user);
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingUser(false);
        }
    }

    const createNewChat = async () => {
        try {
            if (!user) return toast.error("Please login first");
            navigate("/");
            await axios.get("/api/chats/create", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
            await fetchUserChats();
        } catch (error) {
            toast.error(error.message);
        }
    }


    const fetchUserChats = async () => {
        try {
            const { data } = await axios.get("/api/chats/get", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
            if (data.success) {
                setChats(data.chats);
                if (data.chats.length === 0) {
                    await createNewChat();
                    return fetchUserChats();
                } else {
                    setSelectedChat(data.chats[0]);
                }
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (user?._id) {
            fetchUserChats();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user?._id]);


    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);



    const value = {
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        navigate,
        loadingUser,
        setLoadingUser, createNewChat, fetchUserChats, setToken, token, axios
    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);    
