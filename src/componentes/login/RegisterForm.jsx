import React from 'react';

const RegisterForm = ({ email, setEmail, password, setPassword, name, setName, lastname, setLastname, commission, setCommission, legajo, setLegajo, handleRegisterClick, clientID, onSuccessGoogle, onFailureGoogle }) => {
  return (
    <form>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
      <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Apellido" />
      <input type="text" value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="Comisión" />
      <input type="text" value={legajo} onChange={(e) => setLegajo(e.target.value)} placeholder="Legajo" />
      <button onClick={handleRegisterClick}>Registrarse</button>
      <button onClick={onSuccessGoogle}>Registrarse con Google</button>
    </form>
  );
};

export default RegisterForm;
