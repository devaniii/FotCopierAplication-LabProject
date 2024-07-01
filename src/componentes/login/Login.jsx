//Login.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';

function Ingresar({ show, handleClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [commission, setCommission] = useState('');
  const [legajo, setLegajo] = useState('');
  const [formType, setFormType] = useState('login');
  const navigate = useNavigate();

  const clientID = "432321086869-te5kv2n0s6uuf57lk6mr800fglr6ui8g.apps.googleusercontent.com";
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar la visibilidad del modal de inicio de sesión

  const handleLoginClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage('Inicio de sesión exitoso');
        setMessageType('success');
        onSuccess({ email: data.email }); // Envía el correo electrónico del usuario al contexto de sesión
        handleClose();
        navigate('/');
      } else {
        setMessage(data.error);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMessage('Error al iniciar sesión');
      setMessageType('error');
    }
  };
  

  const handleRegisterClick = async () => {
    try {
      const userData = { email, password, name, lastname, commission, legajo };
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Registro exitoso');
        setMessageType('success');
        setShowLoginModal(true); // Mostrar el modal para confirmar iniciar sesión
      } else {
        setMessage(data.error);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMessage('Error al registrar usuario');
      setMessageType('error');
    }
  };

  const onSuccessGoogle = (response) => {
    setMessage('Inicio de sesión con Google exitoso');
    setMessageType('success');
    navigate('/');
  };

  const onFailureGoogle = (response) => {
    console.log("Algo salió mal con Google Login");
    setMessage('Error al iniciar sesión con Google');
    setMessageType('error');
  };

  const switchToRegister = () => {
    setFormType('register');
    clearMessage(); // Limpiar mensaje al cambiar entre formularios
  };

  const switchToLogin = () => {
    setFormType('login');
    clearMessage(); // Limpiar mensaje al cambiar entre formularios
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const handleAcceptLogin = () => {
    setShowLoginModal(false); // Ocultar el modal de confirmación
    handleLoginClick(); // Llamar a la función para iniciar sesión
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="Modal">
        <Modal.Header className='Modal-Header' closeButton>
          <Modal.Title className='Modal-Title'>{formType === 'login' ? 'Iniciar Sesión' : 'Registro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Modal-Body">
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
          {formType === 'login' && (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLoginClick={handleLoginClick}
              clientID={clientID}
              onSuccessGoogle={onSuccessGoogle}
              onFailureGoogle={onFailureGoogle}
            />
          )}
          {formType === 'register' && (
            <RegisterForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              lastname={lastname}
              setLastname={setLastname}
              commission={commission}
              setCommission={setCommission}
              legajo={legajo}
              setLegajo={setLegajo}
              handleRegisterClick={handleRegisterClick}
              clientID={clientID}
              onSuccessGoogle={onSuccessGoogle}
              onFailureGoogle={onFailureGoogle}
            />
          )}
        </Modal.Body>
        <Modal.Footer className='Modal-Footer'>
          <div className="Container-Modal-Footer">
            <div>
              {formType === 'login' ? (
                <Button variant="link" onClick={switchToRegister} className="Form-Link-Button">Registrarse</Button>
              ) : (
                <Button variant="link" onClick={switchToLogin} className="Form-Link-Button">Login</Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para iniciar sesión */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Desea iniciar sesión ahora?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Quiere iniciar sesión directamente con el registro?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAcceptLogin}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const LoginForm = ({ email, setEmail, password, setPassword, handleLoginClick, clientID, onSuccessGoogle, onFailureGoogle }) => (
  <Form className='Form'>
    <Form.Group className="Form-Group" controlId="formBasicEmail">
      <Form.Label className="Form-Label">Email</Form.Label>
      <Form.Control
        className="Form-Control"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="Form-Group" controlId="formBasicPassword">
      <Form.Label className="Form-Label">Contraseña</Form.Label>
      <Form.Control
        className="Form-Control"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Form.Group>
    <div className="Form-Container-Buttons">
      <GoogleLogin
        clientId={clientID}
        onSuccess={onSuccessGoogle}
        onFailure={onFailureGoogle}
        cookiePolicy={"single_host_origin"}
        render={renderProps => (
          <Button variant="light" type="button" onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn-google">
            <FaGoogle style={{ marginRight: '8px' }} /> Google
          </Button>
        )}
      />
      <Button className="Form-Submit-Button" type="button" onClick={handleLoginClick}>
        Iniciar Sesión
      </Button>
    </div>
  </Form>
);

const RegisterForm = ({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  lastname,
  setLastname,
  commission,
  setCommission,
  legajo,
  setLegajo,
  handleRegisterClick,
  clientID,
  onSuccessGoogle,
  onFailureGoogle
}) => (
  <Form className="Form">
    <Form.Group className="Form-Group" controlId="formBasicEmail">
      <Form.Label className="Form-Label">Email</Form.Label>
      <Form.Control
        className="Form-Control"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="Form-Group" controlId="formBasicPassword">
      <Form.Label className="Form-Label">Contraseña</Form.Label>
      <Form.Control
        className="Form-Control"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="Form-Group" controlId="formBasicName">
      <Form.Label className="Form-Label">Nombre</Form.Label>
      <Form.Control
        className="Form-Control"
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="Form-Group" controlId="formBasicLastname">
      <Form.Label className="Form-Label">Apellido</Form.Label>
      <Form.Control
        className="Form-Control"
        type="text"
        placeholder="Enter lastname"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="Form-Group" controlId="formBasicCommission">
      <Form.Label className="Form-Label">Comisión</Form.Label>
      <Form.Control
        className="Form-Control"
        type="text"
        placeholder="Enter commission"
        value={commission}
        onChange={(e) => setCommission(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="Form-Group" controlId="formBasicLegajo">
      <Form.Label className="Form-Label">Legajo</Form.Label>
      <Form.Control
        className="Form-Control"
        type="text"
        placeholder="Enter legajo"
        value={legajo}
        onChange={(e) => setLegajo(e.target.value)}
      />
    </Form.Group>
    <div className="Form-Container-Buttons">
      <GoogleLogin
        clientId={clientID}
        onSuccess={onSuccessGoogle}
        onFailure={onFailureGoogle}
        cookiePolicy={"single_host_origin"}
        render={renderProps => (
          <Button variant="light" type="button" onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn-google">
            <FaGoogle style={{ marginRight: '8px' }} /> Google
          </Button>
        )}
      />
      <Button className="Form-Submit-Button" type="button" onClick={handleRegisterClick}>
        Registrarse
      </Button>
    </div>
  </Form>
);

export default Ingresar;
