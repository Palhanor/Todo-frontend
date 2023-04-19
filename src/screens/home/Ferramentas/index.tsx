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
    <span style={{ cursor: "pointer", position: "relative" }}>
      <FiSettings size={18} onClick={() => setFerramentas((prev) => !prev)} />
      {ferramentas && (
        <div
          style={{
            backgroundColor: "#c2d2e1",
            width: "12rem",
            position: "absolute",
            top: "0.5rem",
            left: "-12.5rem",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid  #b1c5d9",
          }}
        >
          <div
            onClick={() => navigate("/user")}
            style={{
              cursor: "pointer",
              padding: ".8rem 1.2rem",
              backgroundColor: "#c2d2e1",
              border: "none",
              borderRadius: "10px 10px 0 0",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
            }}
          >
            <BiUserCircle size={18} />
            <span style={{ marginLeft: ".4rem" }}>Configurações</span>
          </div>
          <div
            onClick={deslogarUsuario}
            style={{
              cursor: "pointer",
              padding: ".8rem 1.2rem",
              backgroundColor: "#c2d2e1",
              border: "none",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <BiLogOut size={18} />{" "}
            <span style={{ marginLeft: ".4rem" }}>Sair</span>
          </div>
        </div>
      )}
    </span>
  );
}
