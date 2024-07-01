// src/components/DashboardModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function DashboardModal({ show, handleClose, handleLogout }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Configuración de perfil</p>
        <Button variant="light" onClick={handleLogout}>Cerrar sesión</Button>
      </Modal.Body>
    </Modal>
  );
}

export default DashboardModal;
