import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setUiOpenNew } from "../store/slices/index.js";
import { Form, Button, Modal } from "react-bootstrap";
import { Axios } from "../utils/AxiosWithCredentials.js";

export default function BranchModalNew() {
  const { user } = useSelector((state) => state.user);
  const initialState = {
    name: "",
    province: "",
    city: "",
    street: "",
    number: null,
    postalcode: "",
    clientId: user.id,
  };
  const [input, setInput] = useState(initialState);
  const dispatch = useDispatch();
  const { uiOpenNew } = useSelector((state) => state.modalCreate);

  //Crea los nombres de los campos que necesito para crear un nuevo branch
  //heading es lo que voy a ver en el formulario, la key es el nombre de la prop de obj, y el type es para usar en el input de html
  const headingBranchNew = [
    { heading: "Nombre", key: "name", type: "text" },
    { heading: "Provincia", key: "province", type: "text" },
    { heading: "Ciudad", key: "city", type: "text" },
    { heading: "Calle", key: "street", type: "text" },
    { heading: "Altura", key: "number", type: "number" },
    { heading: "Codigo Postal", key: "postalcode", type: "text" },
  ];

  const closeModal = () => {
    dispatch(setUiOpenNew(false));

    //Todo: Cerrar el modal, esta fn la voy a usar al final del handleSubmit
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "number") {
      value = Number(value);
    }

    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("/branches/create", input);
    setInput(initialState);
    closeModal();
  };

  return (
    <Modal
      size="sm"
      show={uiOpenNew}
      onHide={closeModal}
      centered
      aria-labelledby="contained-moda-tittle-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>Nueva Sucursal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {headingBranchNew.map((element, index) => {
            return (
              <div className="mb-3" key={index}>
                <label className="form-label">{element.heading}</label>
                <Form.Control
                  value={input.key}
                  name={element.key}
                  onChange={handleInputChange}
                  required
                />
              </div>
            );
          })}
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
