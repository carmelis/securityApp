import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import imagen from "../assets/styles/image/gris_cuadrado.png";
import style from "../assets/styles/screens/Login.module.scss";
import { Axios } from "../utils/AxiosWithCredentials";
import { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { setUser } from "../store/slices/userSlices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialState = {
    email: "",
    password: "",
  };

  const [input, setInput] = useState(initialState);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("/client/login", input)
      .then((res) => {
        dispatch(setUser(res.data));
        navigate("/home");
      })
      .catch(() => {
        setInput(initialState);
        alert("Email o contraseNa incorrecta");
      });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} className="rounded-5 p-4 mt-4 ">
          <div className={style["divGeneral"]}>
            <img className={style["imagenLog"]} src={imagen} />
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su Email"
                name="email"
                value={input.email}
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={input.password}
                placeholder="Ingrese su Contraseña"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Button type="submit">Ingresar</Button>
          </Form>
          <Form.Text className="text-muted">
            ¿Olvido su contraseña? Haga Click aquí
          </Form.Text>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
