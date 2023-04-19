import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../../interfaces/usuario";
import { userDefault } from "../../utils/modelos";

export default function User() {
  const [usuario, setUsuario] = useState<Usuario>(userDefault);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    configurarUsuario();
  }, []);

  const configurarUsuario = async () => {
    const tokenJWT = localStorage.getItem("auth") || "";
    const retorno = await fetch("http://localhost:3001/user", {
      headers: {
        "x-access-token": tokenJWT,
      },
    });
    const dados = await retorno.json();
    if (dados.result == "Acesso negado!" || dados.result == "Token inválido!") {
      navigate("/login");
    } else {
      setUsuario(() => dados.usuario);
    }
  };

  const atualizarUsuario = async (id: number) => {
    const tokenJWT = localStorage.getItem("auth") || "";
    const retorno = await fetch(`http://localhost:3001/user`, {
      method: "PUT",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-access-token": tokenJWT,
      },
      body: JSON.stringify({
        id_usuario: id,
        nome,
        email,
        senhaAntiga,
        novaSenha,
        confirmacaoSenha,
      }),
    });
    const resultado = await retorno.json();

    if (resultado.result == "Dados do usuário alterados com sucesso!") {
      navigate("/home");
    } else {
      alert(resultado.result);
    }
  };

  const apagarUsuario = async () => {
    const tokenJWT = localStorage.getItem("auth") || "";
    const retorno = await fetch(`http://localhost:3001/user`, {
      method: "DELETE",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-access-token": tokenJWT,
      },
      body: JSON.stringify({
        id_usuario: usuario.id_usuario,
      }),
    });
    const resultado = await retorno.json();

    if (resultado.result == "Usuario apagado") {
      localStorage.removeItem("auth");
      navigate("/login");
    } else {
      alert(resultado.result);
    }
  };

  return (
    <>
      {!!usuario.id_usuario && (
        <div
          style={{
            backgroundColor: "#f7f9fa",
            height: "100vh",
            padding: "3rem 0 1rem",
            overflowY: "scroll",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "50vw",
              background: "white",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
              margin: "0 auto 2rem",
              padding: "2rem",
            }}
          >
            <div
              style={{
                marginBottom: "1rem",
                paddingBottom: "2rem",
                borderBottom: "1px solid lightgray",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", padding: "0 0 .6rem" }}>
                Alterar Nome
              </h2>
              <p>
                <strong>Nome</strong>: {usuario.nome}
              </p>
              <label
                htmlFor="nome"
                style={{ margin: ".8rem 0 .6rem", display: "block" }}
              >
                Novo nome
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Insira seu novo nome"
                onChange={(e) => setNome(() => e.target.value)}
                style={{
                  width: "70%",
                  padding: ".6rem",
                  borderRadius: "5px",
                  border: "1px solid gray",
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{
                marginBottom: "1rem",
                paddingBottom: "2rem",
                borderBottom: "1px solid lightgray",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", padding: "0 0 .6rem" }}>
                Alterar E-mail
              </h2>
              <p>
                <strong>E-mail</strong>: {usuario.email}
              </p>
              <label
                htmlFor="email"
                style={{ margin: ".8rem 0 .6rem", display: "block" }}
              >
                Novo e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Insira seu novo e-mail"
                onChange={(e) => setEmail(() => e.target.value)}
                style={{
                  width: "70%",
                  padding: ".6rem",
                  borderRadius: "5px",
                  border: "1px solid gray",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", padding: "0 0 .6rem" }}>
                Alterar Senha
              </h2>
              <p>
                <strong>Cuidado</strong>: Este sistema ainda não possúi um
                método de recuperação de senha. Assim, ao tomar a decisão de
                alterar sua senha busque tomar todas as precauções para evitar
                perder a senha de entrada na sua conta.
              </p>
              <label
                htmlFor="senhaAtual"
                style={{ margin: ".8rem 0 .6rem", display: "block" }}
              >
                Senha atual
              </label>
              <input
                id="senhaAtual"
                type="password"
                placeholder="Insira sua senha atual"
                onChange={(e) => setSenhaAntiga(() => e.target.value)}
                style={{
                  width: "70%",
                  padding: ".6rem",
                  borderRadius: "5px",
                  border: "1px solid gray",
                  outline: "none",
                }}
              />
              <label
                htmlFor="novaSenha"
                style={{ margin: ".8rem 0 .6rem", display: "block" }}
              >
                Nova senha
              </label>
              <input
                id="novaSenha"
                type="password"
                placeholder="Insira sua nova senha"
                onChange={(e) => setNovaSenha(() => e.target.value)}
                style={{
                  width: "70%",
                  padding: ".6rem",
                  borderRadius: "5px",
                  border: "1px solid gray",
                  outline: "none",
                }}
              />
              <label
                htmlFor="confirmacaoSenha"
                style={{ margin: ".8rem 0 .6rem", display: "block" }}
              >
                Confirmação da senha
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <input
                  id="confirmacaoSenha"
                  type="password"
                  placeholder="Confirme sua nova senha"
                  onChange={(e) => setConfirmacaoSenha(() => e.target.value)}
                  style={{
                    width: "70%",
                    padding: ".6rem",
                    borderRadius: "5px",
                    border: "1px solid gray",
                    outline: "none",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <button
                type="submit"
                style={{
                  width: "20%",
                  padding: ".6rem 0",
                  borderRadius: "5px",
                  border: "1px solid #86a5c3",
                  backgroundColor: "#86a5c3",
                  cursor: "pointer",
                  marginTop: "2rem",
                }}
                onClick={() => atualizarUsuario(usuario.id_usuario)}
              >
                Salvar alterações
              </button>
            </div>
          </div>
          <div
            style={{
              width: "50vw",
              background: "white",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
              margin: "0 auto 2rem",
              padding: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", padding: "0 0 .6rem" }}>
              Excluir conta
            </h2>
            <p>
              <strong>Perigo</strong>: Após realizada a exclusão da conta, a
              ação não poderá ser desfaita. Tome esta decisão com cuidado.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <button
                type="submit"
                style={{
                  width: "20%",
                  padding: ".6rem 0",
                  borderRadius: "5px",
                  border: "1px solid #e52727",
                  backgroundColor: "#e52727",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
                onClick={apagarUsuario}
              >
                Excluir conta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
