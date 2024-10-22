import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/appwrite"
import AsyncStorage from '@react-native-async-storage/async-storage';


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('user'); // this line was added to check if user data exists in AsyncStorage
                if (savedUser) {
                    setUser(JSON.parse(savedUser)); // this line was added to parse and set the saved user data
                    setIsLoggedIn(true); // this line was added to set the login state to true if the user is found
                } else {
                    const currentUser = await getCurrentUser();
                    if (currentUser) {
                        await AsyncStorage.setItem('user', JSON.stringify(currentUser)); // this line was added to store user data in AsyncStorage
                        setUser(currentUser);
                        setIsLoggedIn(true);
                    }
                    else {
                        setIsLoggedIn(false);
                    }
                }
            } catch (error) {
                console.log("Error checking user session: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserSession();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
