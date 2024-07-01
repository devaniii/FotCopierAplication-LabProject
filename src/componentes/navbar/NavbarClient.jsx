// NavbarClient.jsx

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../../assets/styles/components/NavbarClient.css';
import Ingresar from '../login/Login';
import logoImage from '../../assets/images/F.png';
import { useSession } from '../SessionContext';

function NavbarClient() {
    const { loggedInUser, login, logout } = useSession();
    const [showModal, setShowModal] = useState(false);
    const [showUserOptions, setShowUserOptions] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleLoginSuccess = (userProfile) => {
        login(userProfile); // Llama a la función de login del contexto de sesión
        setShowModal(false); // Cierra el modal después del inicio de sesión exitoso
    };

    const handleLogout = () => {
        logout(); // Llama a la función de logout del contexto de sesión
        setShowUserOptions(false); // Opcional: oculta las opciones de usuario después de cerrar sesión
    };

    const handleUserOptions = () => {
        setShowUserOptions(!showUserOptions);
    };

    return (
        <nav className='navegation'>
            <div className='logoType-Cont'>
                <div className='LogoFotCopier'>
                    <img src={logoImage} alt='FotCopier Logo' />
                </div>
                <div className='TextFotCopier'><p>FotCopier</p></div>
            </div>
            <div className='linksType-Cont'>
                <ul className='linksType'>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/orders">Orders</Link>
                    </li>
                    <li>
                        <Link to="/products">Products</Link>
                    </li>
                    <li>
                        <Link to="/receipts">Receipts</Link>
                    </li>
                    <li>
                        <Link to="/statistics">Statistics</Link>
                    </li>
                </ul>
            </div>

            <div className='LoginUser-Cont'>
                    <div className='LoginUser'>
                        {loggedInUser ? (
                            <div className="user-options">
                            <p style={{ color: 'black' }} onClick={handleUserOptions}>{loggedInUser.email}</p>
                            {showUserOptions && (
                                <div className="user-options-popup">
                                <ul>
                                    <li><Link to="/perfil">Perfil</Link></li>
                                    <li><Link to="/configuracion">Configuración</Link></li>
                                    <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                                </ul>
                                </div>
                            )}
                            </div>
                        ) : (
                            <NavLink to="#" onClick={handleShowModal}>Iniciar Sesión</NavLink>
                        )}
                    </div>

            </div>
            <Ingresar show={showModal} handleClose={handleCloseModal} onSuccess={handleLoginSuccess} />
        </nav>
    );
}

export default NavbarClient;
