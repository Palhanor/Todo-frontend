import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";

export default function Login() {
  const [naoAutenticado, setNaoAutenticado] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [visualizarSenha, setVisualizarSenha] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const tokenJWT = localStorage.getItem("auth") || "";
        await api.get("/auth", {
          headers: {
            "x-access-token": tokenJWT,
          },
        });
        navigate("/home");
      } catch (error) {
        setNaoAutenticado(() => true);
      }
    })();
  }, []);

  const executarLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      email,
      senha,
    };
    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("auth", data.token);
      navigate("/home");
    } catch (error: any) {
      const result = error.response.data.result;
      alert(result);
    }
  };

  const exibirEsconderSenha = () => {
    setVisualizarSenha((prev) => !prev);
  };

  const handleEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(() => e.target.value);
  };

  const handleSenhaValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(() => e.target.value);
  };

  const style = {
    tela: "bg-[#f7f9fa] h-screen pt-44 box-border",
    container: "w-1/3 m-auto bg-white rounded-xl shadow-lg box-border p-7 pt-6",
    titulo: "text-2xl font-semibold mt-2 mb-5 text-center",
    label: "block mb-3",
    input:
      "w-full rounded-md p-3 border border-solid border-gray-400 mb-3 box-border outline-none",
    inputSenha:
      "rounded-l-md p-3 grow border border-solid border-gray-400 border-r-0 outline-none",
    visualiadorSenha:
      "rounded-r-md p-3 flex items-center cursor-pointer border border-solid border-gray-400 border-l-0",
    botao:
      "w-full p-4 border-none rounded-md bg-[#86a5c3] cursor-pointer mt-6 mb-8 hover:bg-[#7999b8]",
    linkContainer:
      "text-center w-5/6 m-auto text-small border-t border-solid border-gray-300 pt-6",
    link: "text-small text-gray-400",
  };

  return (
    <>
      {naoAutenticado && (
        <div className={style.tela}>
          <div className={style.container}>
            <h1 className={style.titulo}>Entrar</h1>
            <form onSubmit={executarLogin}>
              <label htmlFor="email" className={style.label}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="E-mail cadastrado"
                value={email}
                onChange={handleEmailValue}
                className={style.input}
              />
              <label htmlFor="senha" className={style.label}>
                Senha
              </label>
              <div className="flex">
                <input
                  id="senha"
                  type={!visualizarSenha ? "password" : "text"}
                  placeholder="Senha cadastrada"
                  value={senha}
                  onChange={handleSenhaValue}
                  className={style.inputSenha}
                />
                <span
                  onClick={exibirEsconderSenha}
                  className={style.visualiadorSenha}
                >
                  {visualizarSenha ? (
                    <AiFillEyeInvisible size={20} color="#666" />
                  ) : (
                    <AiFillEye size={20} color="#666" />
                  )}
                </span>
              </div>
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
