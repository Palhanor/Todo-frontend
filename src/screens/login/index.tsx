import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [autenticado, setAutenticado] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenJWT = localStorage.getItem("auth") || "";
    fetch("http://localhost:3001/auth", {
      headers: {
        "x-access-token": tokenJWT,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.result == "Usuário autenticado!") {
          navigate("/home");
        } else {
          setAutenticado(() => true);
        }
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.result == "Usuário autenticado") {
          localStorage.setItem("auth", res.token);
          navigate("/home");
        } else {
          alert(res.result);
        }
      });
  };

  return (
    <>
      {autenticado && (
        <div
          style={{
            backgroundColor: "#f7f9fa",
            height: "100vh",
            paddingTop: "20vh",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "25vw",
              margin: "auto",
              background: "white",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              boxSizing: "border-box",
              padding: "1rem 1.5rem 2rem",
            }}
          >
            <h1 style={{ fontSize: "1.3rem", padding: ".6rem 0" }}>Entrar</h1>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: ".5rem" }}
              >
                Endereço de E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="E-mail cadastrado"
                value={email}
                onChange={(e) => setEmail(() => e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  padding: ".6rem",
                  border: "1px solid gray",
                  marginBottom: ".8rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <label
                htmlFor="senha"
                style={{ display: "block", marginBottom: ".5rem" }}
              >
                Senha do usuário
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Senha cadastrada"
                value={senha}
                onChange={(e) => setSenha(() => e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  padding: ".6rem",
                  border: "1px solid gray",
                  marginBottom: ".8rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: ".6rem",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#86a5c3",
                  cursor: "pointer",
                  margin: ".6rem 0 1rem",
                }}
              >
                Entrar
              </button>
              <a
                href="http://localhost:5173/register"
                style={{ fontSize: ".9rem", textDecoration: "none" }}
              >
                Não tenho cadastro!
              </a>
              {/* <a href="#">Esqueci a senha!</a> */}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
