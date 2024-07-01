import React from 'react';

const LoginForm = ({ email, setEmail, password, setPassword, handleLoginClick, clientID, onSuccessGoogle, onFailureGoogle }) => {
  return (
    <form>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button onClick={handleLoginClick}>Iniciar Sesión</button>
      <button onClick={onSuccessGoogle}>Iniciar con Google</button>
    </form>
  );
};

export default LoginForm;
