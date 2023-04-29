import { useState } from "react";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Ferramentas() {
  const [ferramentas, setFerramentas] = useState<boolean>(false);
  const navigate = useNavigate();

  const deslogarUsuario = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const style = {
    icone: "cursor-pointer relative",
    container:
      "bg-[#c2d2e1] w-48 absolute top-2 -left-48 rounded-lg flex flex-col shadow",
    primeiraOpcao:
      "cursor-pointer py-4 px-5 bg-[#c2d2e1] border-none flex items-center rounded-t-md text-left hover:bg-[#b8c8d7]",
    ultimaOpcao:
      "cursor-pointer py-4 px-5 bg-[#c2d2e1] border-none flex items-center rounded-b-md text-left hover:bg-[#b8c8d7]",
    ilustracao: "ml-2",
  };

  return (
    <span className={style.icone}>
      <FiSettings size={16} onClick={() => setFerramentas((prev) => !prev)} />
      {ferramentas && (
        <div className={style.container}>
          <div
            onClick={() => navigate("/user")}
            className={style.primeiraOpcao}
          >
            <BiUserCircle size={18} />
            <span className={style.ilustracao}>Configurações</span>
          </div>
          <div onClick={deslogarUsuario} className={style.ultimaOpcao}>
            <BiLogOut size={18} />{" "}
            <span className={style.ilustracao}>Sair</span>
          </div>
        </div>
      )}
    </span>
  );
}
