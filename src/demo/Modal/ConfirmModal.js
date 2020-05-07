import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ConfirmModal(props) {

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} animation={true} size={props.size}
            backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.title? props.title : 'Confirmation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        { props.handleConfirm &&
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={props.handleConfirm}>
              Confirm
            </Button>
          </Modal.Footer>
        }
      </Modal>
    </>
  );
}
