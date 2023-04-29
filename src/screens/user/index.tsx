import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../../interfaces/usuario";
import { userDefault } from "../../utils/modelos";
import Loading from "../Loading";
import { BsArrowLeft } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgDanger } from "react-icons/cg";
import "./style.css"

export default function User() {
  const [usuario, setUsuario] = useState<Usuario>(userDefault);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  const [visualizacao, setVisualizacao] = useState<
    "conta" | "senha" | "avançado"
  >("conta");

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
    tela: "flex h-screen box-border bg-[#f7f9fa]",
    barraEsquerda: "w-[25vw] p-5 h-screen box-border bg-[#e2e9f0]",
    voltar: "cursor-pointer mb-5 flex items-center gap-2 text-xl font-medium",
    nomeUsuario: "text-lg my-2 font-semibold",
    email: "block text-md text-slate-700 mb-4",
    item: "flex items-center gap-2 text-lg px-3 py-2 w-full box-border text-normal cursor-pointer mb-2 rounded-md capitalize",
    container: "w-2/3 bg-white rounded-md shadow m-auto mb-5 p-8",
    secao: "mb-4 pb-5 border-b border-b-solid border-gray-200",
    tituloSecao: "text-xl pb-4 font-semibold",
    label: "block mt-4 mb-2",
    input:
      "w-full p-2.5 rounded-md border border-solid border-gray-400 outline-none",
    containerBotao: "flex justify-end w-full",
    botao: (cor: string) => {
      return `w-1/4 py-2.5 rounded-md border-none bg-[${cor}] cursor-pointer mt-5`;
    },
  };

  return (
    <>
      {!!usuario.id_usuario ? (
        <div className={style.tela}>
          <aside className={style.barraEsquerda}>
            <div className={style.voltar} onClick={() => navigate("/home")}>
              <BsArrowLeft size={24} /> Voltar
            </div>
            <h1 className={style.nomeUsuario}>{usuario.nome}</h1>
            <p className={style.email}>{usuario.email}</p>
            <div>
              <ul>
                <li
                  className={style.item}
                  style={{
                    backgroundColor:
                      visualizacao == "conta" ? "#86a5c3" : "transparent",
                  }}
                  onClick={() => setVisualizacao(() => "conta")}
                >
                  <FaRegUserCircle />
                  Conta
                </li>
                <li
                  className={style.item}
                  style={{
                    backgroundColor:
                      visualizacao == "senha" ? "#86a5c3" : "transparent",
                  }}
                  onClick={() => setVisualizacao(() => "senha")}
                >
                  <RiLockPasswordLine />
                  Senha
                </li>
                <li
                  className={style.item}
                  style={{
                    backgroundColor:
                      visualizacao == "avançado" ? "#86a5c3" : "transparent",
                  }}
                  onClick={() => setVisualizacao(() => "avançado")}
                >
                  <CgDanger />
                  Avançado
                </li>
              </ul>
            </div>
          </aside>
          <div className="configuracoes_usuairo w-[75vw] overflow-y-auto py-10">
            {visualizacao == "conta" && (
              <>
                <div className={style.container}>
                  <h2 className={style.tituloSecao}>Nome de Usuário</h2>
                  <p>
                    Seu nome de usuário é usado apenas dentro da tela principal
                    para que o usário identifique a conta em que está logado.
                    Este não precisa ser único ou mesmo seu nome pessoal.
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
                  <div className={style.containerBotao}>
                    <button
                      type="submit"
                      className={style.botao("#86a5c3")}
                      onClick={() => atualizarUsuario(usuario.id_usuario)}
                    >
                      Salvar nome
                    </button>
                  </div>
                </div>

                <div className={style.container}>
                  <h2 className={style.tituloSecao}>Endereço de E-mail</h2>
                  <p>
                    <strong>Atenção</strong>: O endereço de e-mail deve ser
                    único e, caso contrário, não será possível efetuar a mudança
                    do endereço de e-mail. Além disso, o sistema não conta com
                    sistema de confimação por e-mail, para verifiar endereços
                    inválidos.
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
                  <div className={style.containerBotao}>
                    <button
                      type="submit"
                      className={style.botao("#86a5c3")}
                      onClick={() => atualizarUsuario(usuario.id_usuario)}
                    >
                      Salvar e-mail
                    </button>
                  </div>
                </div>
              </>
            )}
            {visualizacao == "senha" && (
              <div className={style.container}>
                <div>
                  <h2 className={style.tituloSecao}>Alterar Senha</h2>
                  <p>
                    <strong>Cuidado</strong>: Este sistema ainda não possúi um
                    método de recuperação de senha. Assim, ao tomar a decisão de
                    alterar sua senha busque tomar todas as precauções para
                    evitar perder a senha de entrada na sua conta.
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
                    Salvar senha
                  </button>
                </div>
              </div>
            )}
            {visualizacao == "avançado" && (
              <div className={style.container}>
                <h2 className={style.tituloSecao}>Excluir conta</h2>
                <p>
                  <strong>Perigo</strong>: O sistema não possúi botão de
                  confirmação, e após clicado no botão de exclusão de conta, a
                  ação não poderá ser desfeita. Tome esta decisão com cuidado.
                </p>
                <div className={style.containerBotao}>
                  <button
                    type="submit"
                    className={style.botao("#e52727")}
                    style={{backgroundColor: "#e52727"}}
                    onClick={apagarUsuario}
                  >
                    Excluir conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
