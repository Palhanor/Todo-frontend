import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [autenticado, setAutenticado] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
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
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        email: email,
        senha: senha,
        senhaConfirmacao: senhaConfirmacao,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.result == "Cadastro realizado com sucesso") {
          setNome(() => "");
          setEmail(() => "");
          setSenha(() => "");
          setSenhaConfirmacao(() => "");
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
            <h1 style={{ fontSize: "1.3rem", padding: ".6rem 0" }}>Cadastro</h1>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="nome"
                style={{ display: "block", marginBottom: ".5rem" }}
              >
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(() => e.target.value)}
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
                htmlFor="email"
                style={{ display: "block", marginBottom: ".5rem" }}
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Melhor endereço de E-mail"
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
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Senha segura"
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
              <label
                htmlFor="confirmacaoSenha"
                style={{ display: "block", marginBottom: ".5rem" }}
              >
                Confirmação de senha
              </label>
              <input
                id="confirmacaoSenha"
                type="password"
                placeholder="Confirmação da senha"
                value={senhaConfirmacao}
                onChange={(e) => setSenhaConfirmacao(() => e.target.value)}
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
                Cadastrar
              </button>
              <a
                href="http://localhost:5173/login"
                style={{ fontSize: ".9rem", textDecoration: "none" }}
              >
                Já possuo um cadastro!
              </a>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
