import React, { useState } from "react";
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

  return (
    <span className="cursor-pointer relative">
      <FiSettings size={18} onClick={() => setFerramentas((prev) => !prev)} />
      {ferramentas && (
        <div className="bg-[#c2d2e1] w-48 absolute top-2 -left-48 rounded-lg flex flex-col shadow">
          <div
            onClick={() => navigate("/user")}
            className="cursor-pointer py-4 px-5 bg-[#c2d2e1] border-none flex items-center rounded-t-md text-left hover:bg-[#b8c8d7]"
          >
            <BiUserCircle size={18} />
            <span className="ml-2">Configurações</span>
          </div>
          <div
            onClick={deslogarUsuario}
            className="cursor-pointer py-4 px-5 bg-[#c2d2e1] border-none flex items-center rounded-b-md text-left hover:bg-[#b8c8d7]"
          >
            <BiLogOut size={18} /> <span className="ml-2">Sair</span>
          </div>
        </div>
      )}
    </span>
  );
}
