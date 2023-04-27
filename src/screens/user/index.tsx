import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../../interfaces/usuario";
import { userDefault } from "../../utils/modelos";
import Loading from "../Loading";

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

  const style = {
    tela: "h-screen pt-8 pb-4 overflow-y-scroll box-border bg-[#f7f9fa]",
    container: "w-1/2 bg-white rounded-md shadow m-auto mb-5 p-8",
    secao: "mb-4 pb-5 border-b border-b-solid border-gray-200",
    tituloSecao: "text-xl pb-4 font-semibold",
    label: "block my-4",
    input:
      "w-full p-3 rounded-md border border-solid border-gray-400 outline-none",
    containerBotao: "flex justify-end w-full",
    botao: (cor: string) => {
      return `w-1/4 py-4 rounded-md border-none bg-[${cor}] cursor-pointer mt-8`;
    },
  };

  return (
    <>
      {!!usuario.id_usuario ? (
        <div className={style.tela}>
          <div className={style.container}>
            <div className={style.secao}>
              <h2 className={style.tituloSecao}>Alterar Nome</h2>
              <p>
                <strong>Nome</strong>: {usuario.nome}
              </p>
              <label htmlFor="nome" className={style.label}>
                Novo nome
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Insira seu novo nome"
                className={style.input}
                onChange={(e) => setNome(() => e.target.value)}
              />
            </div>
            <div className={style.secao}>
              <h2 className={style.tituloSecao}>Alterar E-mail</h2>
              <p>
                <strong>E-mail</strong>: {usuario.email}
              </p>
              <label htmlFor="email" className={style.label}>
                Novo e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Insira seu novo e-mail"
                className={style.input}
                onChange={(e) => setEmail(() => e.target.value)}
              />
            </div>
            <div>
              <h2 className={style.tituloSecao}>Alterar Senha</h2>
              <p>
                <strong>Cuidado</strong>: Este sistema ainda não possúi um
                método de recuperação de senha. Assim, ao tomar a decisão de
                alterar sua senha busque tomar todas as precauções para evitar
                perder a senha de entrada na sua conta.
              </p>
              <label htmlFor="senhaAtual" className={style.label}>
                Senha atual
              </label>
              <input
                id="senhaAtual"
                type="password"
                placeholder="Insira sua senha atual"
                onChange={(e) => setSenhaAntiga(() => e.target.value)}
                className={style.input}
              />
              <label htmlFor="novaSenha" className={style.label}>
                Nova senha
              </label>
              <input
                id="novaSenha"
                type="password"
                placeholder="Insira sua nova senha"
                onChange={(e) => setNovaSenha(() => e.target.value)}
                className={style.input}
              />
              <label htmlFor="confirmacaoSenha" className={style.label}>
                Confirmação da senha
              </label>
              <input
                id="confirmacaoSenha"
                type="password"
                placeholder="Confirme sua nova senha"
                onChange={(e) => setConfirmacaoSenha(() => e.target.value)}
                className={style.input}
              />
            </div>
            <div className={style.containerBotao}>
              <button
                type="submit"
                className={style.botao("#86a5c3")}
                onClick={() => atualizarUsuario(usuario.id_usuario)}
              >
                Salvar alterações
              </button>
            </div>
          </div>
          <div className={style.container}>
            <h2 className={style.tituloSecao}>Excluir conta</h2>
            <p>
              <strong>Perigo</strong>: Após realizada a exclusão da conta, a
              ação não poderá ser desfaita. Tome esta decisão com cuidado.
            </p>
            <div className={style.containerBotao}>
              <button
                type="submit"
                className={style.botao("#e52727")}
                onClick={apagarUsuario}
              >
                Excluir conta
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
