import { useEffect, useState } from "react";
import Usuario from "../interfaces/usuario";
import { userDefault } from "../utils/modelos";
import { useNavigate } from "react-router-dom";
// import api from "../service/api";
import api from "../service/api";

export const useUsuario = () => {
  const [user, setUser] = useState<Usuario>(userDefault);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const tokenJWT = localStorage.getItem("auth") || "";
        const { data } = await api.get("/user", {
          headers: { "x-access-token": tokenJWT },
        });
        setUser(() => data.usuario);
      } catch (error: any) {
        const result = error.response.data.result;
        if (result == "Acesso negado!" || result == "Token inválido!")
          navigate("/login");
      }
    })();
  }, []);

  return { user };
};
