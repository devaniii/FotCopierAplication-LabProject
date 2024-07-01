// SessionContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

export const SessionProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
            setLoggedInUser(user); // Asegúrate de establecer el usuario correctamente
        }
    }, []);

    const login = (userProfile) => {
      localStorage.setItem('user', JSON.stringify(userProfile));
      setLoggedInUser(userProfile); // Actualiza loggedInUser con el perfil completo del usuario
    };
    
    const logout = () => {
        localStorage.removeItem('user');
        setLoggedInUser(null); // Borra loggedInUser después de cerrar sesión
    };

    const value = {
        loggedInUser,
        login,
        logout,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};