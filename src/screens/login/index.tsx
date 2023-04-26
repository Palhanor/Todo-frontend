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

  const style = {
    tela: "bg-[#f7f9fa] h-screen pt-44 box-border",
    container: "w-1/3 m-auto bg-white rounded-xl shadow-lg box-border p-7 pt-6",
    titulo: "text-2xl font-semibold mt-2 mb-5 text-center",
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
            <h1 className={style.titulo}>Entrar</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className={style.label}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="E-mail cadastrado"
                value={email}
                onChange={(e) => setEmail(() => e.target.value)}
                className={style.input}
              />
              <label htmlFor="senha" className={style.label}>
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Senha cadastrada"
                value={senha}
                onChange={(e) => setSenha(() => e.target.value)}
                className={style.input}
              />
              <button type="submit" className={style.botao}>
                Entrar
              </button>
              <div className={style.linkContainer}>
                <span>Ainda sem uma conta? </span>
                <a href="./register" className={style.link}>
                  Cadastre-se!
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
