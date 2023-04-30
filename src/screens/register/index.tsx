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

  const realiarCadastro = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleNomeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(() => e.target.value);
  };
  const handleEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(() => e.target.value);
  };
  const handleSenhaValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(() => e.target.value);
  };
  const handleConfimacaoSenhaValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSenhaConfirmacao(() => e.target.value);
  };

  const style = {
    tela: "bg-[#f7f9fa] h-screen pt-14 box-border",
    container: "w-1/3 m-auto bg-white rounded-md shadow-lg box-border p-7 pt-6",
    titulo: "text-center text-2xl font-semibold mt-2 mb-5",
    label: "block mb-3",
    input:
      "w-full rounded-md p-3 border border-solid border-gray-400 mb-3 box-border outline-none",
    botao:
      "w-full p-4 border-none rounded-md bg-[#86a5c3] cursor-pointer mt-6 mb-8 hover:bg-[#7999b8]",
    linkContainer:
      "text-center w-5/6 m-auto text-small border-t border-solid border-gray-300 pt-6",
    link: "text-small text-gray-400",
  };

  return (
    <>
      {autenticado && (
        <div className={style.tela}>
          <div className={style.container}>
            <h1 className={style.titulo}>Cadastro</h1>
            <form onSubmit={realiarCadastro}>
              <label htmlFor="nome" className={style.label}>
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={handleNomeValue}
                className={style.input}
              />
              <label htmlFor="email" className={style.label}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Melhor endereço de E-mail"
                value={email}
                onChange={handleEmailValue}
                className={style.input}
              />
              <label htmlFor="senha" className={style.label}>
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Senha segura"
                value={senha}
                onChange={handleSenhaValue}
                className={style.input}
              />
              <label htmlFor="confirmacaoSenha" className={style.label}>
                Confirmação de senha
              </label>
              <input
                id="confirmacaoSenha"
                type="password"
                placeholder="Confirmação da senha"
                value={senhaConfirmacao}
                onChange={handleConfimacaoSenhaValue}
                className={style.input}
              />
              <button type="submit" className={style.botao}>
                Cadastrar
              </button>
              <div className={style.linkContainer}>
                <span>Já possui uma conta? </span>
                <a href="http://localhost:5173/login" className={style.link}>
                  Entre!
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
