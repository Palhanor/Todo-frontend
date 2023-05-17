import { useNavigate, useRouteError } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();
  const error: any = useRouteError();
  const status = String(error.status);

  const navegarParaHome = () => {
    navigate("/home");
  };

  const style = {
    tela: `bg-[#e2e9f0] h-screen pt-44 box-border`,
    container: "w-2/5 m-auto bg-white rounded-xl shadow-lg box-border p-8",
    erro: "text-8xl font-semibold mt-2 mb-6 text-center",
    titulo: "text-2xl font-medium mb-5 text-center",
    texto: "block m-auto text-center text-base w-5/6 text-gray-400",
    botao: `w-2/5 m-auto block p-4 border-none rounded-md bg-[#86a5c3] cursor-pointer my-8`,
  };

  return (
    <div className={style.tela}>
      <div className={style.container}>
        <h1 className={style.erro}>
          {status[0]}
          <span className={`text-tema text-8xl font-semibold text-[#86a5c3]`}>
            {status[1]}
          </span>
          {status[2]}
        </h1>
        <h2 className={style.titulo}>Página não enocntrada!</h2>
        <p className={style.texto}>
          A página requisitada pode ter sido removida, mudado o endereço da URL,
          ou está indisponível no momento.
        </p>
        <button className={style.botao} onClick={navegarParaHome}>
          Voltar para Home
        </button>
      </div>
    </div>
  );
}
