import React from 'react';
import './assets/styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeClient from './pages/HomeClient';
import OrderPage from './pages/OrderPage';
import NavbarClient from './componentes/navbar/NavbarClient'; // Corregido la ruta de importación
import './assets/styles/components/NavbarClient.css';
import Ingresar from './componentes/login/Login'; // Corregido la ruta de importación
import { SessionProvider } from './componentes/SessionContext'; // Contexto de sesión existente
import { Provider } from 'react-redux'; // Provider de Redux
import store from './redux/store'; // Store de Redux

function App() {
  return (
    <SessionProvider>
      <Provider store={store}>
        <Router>
          <div className="App">
            <NavbarClient />
            <Routes>
              <Route path="/" element={<HomeClient />} />
              <Route path="/order-form" element={<OrderPage />} />
              <Route path="/login" element={<Ingresar />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </SessionProvider>
  );
}

export default App;
