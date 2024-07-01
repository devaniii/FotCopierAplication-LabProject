import React, { useState, useEffect } from 'react';

function ProfilePage({ loggedInUser }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Aquí podrías realizar una solicitud al backend para obtener más información del usuario si es necesario
    // Podrías pasar el token almacenado en localStorage en la solicitud para autenticar al usuario en el backend
    // Ejemplo:
    // fetch('http://localhost:5000/user-profile', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // })
    // .then(response => response.json())
    // .then(data => setUserProfile(data))
    // .catch(error => console.error('Error fetching user profile:', error));
    
    // En este ejemplo, solo mostramos el nombre del usuario que ha iniciado sesión
    setUserProfile({ name: loggedInUser });
  }, [loggedInUser]);

  return (
    <div className="profile-page">
      <h2>Perfil de Usuario</h2>
      {userProfile ? (
        <div>
          <p><strong>Nombre:</strong> {userProfile.name}</p>
          {/* Puedes mostrar más información del perfil aquí si es necesario */}
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}

export default ProfilePage;
