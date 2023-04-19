// TODO: Criar rotas 404 no React Router DOM
// TODO: Salvar as cores dentro do MySQL como 7 caracteres
// TODO: Usar um sistema de estilização (Tailwinds) e melhorar o design do sistema

// TODO: Adicionar os números de tarefas ao lados das visualizações - numero aplicando os filtros (categoria, busca e data)

// TODO: Implementar um filtro de busca por termos - acima de visualizações
// TODO: Implementar um filtro por prazos (dia especifico) - acima de visualizações
// TODO: Implementar um limpador do filtro de prazos (dia especifico) - acima de visualizações

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "./Editor";
import Categorias from "./Categorias";
import Tarefas from "./Tarefas";
import FormTarefa from "./FormTarefa";
import Ferramentas from "./Ferramentas";
import { tarefaDefault, userDefault } from "../../utils/modelos";
import Tarefa from "../../interfaces/tarefa";
import Usuario from "../../interfaces/usuario";
import { abas, edicaoTarefa } from "../../interfaces/types";
import Categoria from "../../interfaces/categoria";
import "./style.css";

export default function Home() {
  const [user, setUser] = useState<Usuario>(userDefault);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [tarefaSelecionada, setTarefaSelecionada] =
    useState<Tarefa>(tarefaDefault);
  const [categoriasAtivas, setCategoriasAtivas] = useState<number[]>([]);
  const [abaTarefas, setAbaTarefas] = useState<abas>("atuais");

  const navigate = useNavigate();

  useEffect(() => {
    configurarUsuario();
    listarTarefas();
    listarCategorias();
  }, []);

  const editarTarefaCheck = (tarefa: Tarefa) => {
    setTarefas((current: Tarefa[]) =>
      current.map((tarefaAtual: Tarefa) => {
        if (tarefaAtual.id_tarefa == tarefa.id_tarefa)
          return {
            ...tarefaAtual,
            realizada: +!tarefa.realizada,
          };
        else return tarefaAtual;
      })
    );
  };

  const editarTarefaDados = (tarefa: Tarefa) => {
    setTarefas((current: Tarefa[]) =>
      current.map((tarefaAtual: Tarefa) => {
        if (tarefaAtual.id_tarefa == tarefa.id_tarefa) return tarefa;
        else return tarefaAtual;
      })
    );
  };

  const editarTarefaCategoria = (tarefa: Tarefa) => {
    setTarefaSelecionada(() => tarefa);
    setTarefas((tarefas) =>
      tarefas.map((tarefaAntiga) => {
        return tarefaAntiga.id_tarefa !== tarefa.id_tarefa
          ? tarefaAntiga
          : tarefa;
      })
    );
  };

  const requisidor = async (rota: string, metodo?: string, dados?: any) => {
    const tokenJWT = localStorage.getItem("auth") || "";
    if (metodo && dados) {
      const retorno = await fetch(`http://localhost:3001/${rota}`, {
        method: `${metodo}`,
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "x-access-token": tokenJWT,
        },
        body: JSON.stringify(dados),
      });
      const result = await retorno.json();
      return result;
    } else {
      const retorno = await fetch(`http://localhost:3001/${rota}`, {
        headers: {
          "x-access-token": tokenJWT,
        },
      });
      const result = await retorno.json();
      return result;
    }
  };

  const configurarUsuario = async () => {
    const retorno = await requisidor("user");
    if (
      retorno.result == "Acesso negado!" ||
      retorno.result == "Token inválido!"
    ) {
      navigate("/login");
    } else {
      setUser(() => retorno.usuario);
    }
  };

  const listarTarefas = async () => {
    const retorno = await requisidor("tasks");
    setTarefas(() =>
      retorno.map((tarefa: Tarefa) => {
        return { ...tarefa, data_final: tarefa.data_final.substring(0, 10) };
      })
    );
  };

  const listarCategorias = async () => {
    const retorno = await requisidor("category");
    setCategorias(() => retorno);
    setCategoriasAtivas(() => [
      0,
      ...retorno.map((retorno: Categoria) => retorno.id_categoria),
    ]);
  };

  const editarTarefa = async (tarefa: Tarefa, tipo: edicaoTarefa) => {
    if (tipo == "check")
      setTarefaSelecionada(() => {
        return tarefaDefault;
      });

    const dados = {
      id_tarefa: tarefa.id_tarefa,
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      data_final: tarefa.data_final,
      categoria: tarefa.categoria,
      realizada: tipo == "check" ? +!tarefa.realizada : +tarefa.realizada,
    };
    const retorno = await requisidor("tasks", "PUT", dados);

    if (retorno.result == "Atividade atualizada com sucesso!") {
      if (tipo == "check") {
        editarTarefaCheck(tarefa);
      } else if (tipo == "dados") {
        editarTarefaDados(tarefa);
      } else if (tipo == "categoria") {
        editarTarefaCategoria(tarefa);
      }
    } else {
      alert(retorno.result);
    }
  };

  return (
    <>
      {!!user.id_usuario && (
        <div style={{ display: "flex" }}>
          <aside
            style={{
              width: "20vw",
              // width: "25vw",
              padding: "1.5rem",
              boxSizing: "border-box",
              height: "100vh",
              borderRight: "1px solid #e1e7e9",
              justifyContent: "space-between",
              backgroundColor: "#e2e9f0",
              overflow: "none",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1
                  style={{
                    fontSize: "1.2rem",
                    margin: ".5rem 0",
                    fontWeight: "600",
                  }}
                >
                  {user.nome}
                </h1>
                <Ferramentas />
              </div>
              <p
                style={{
                  display: "block",
                  fontSize: ".9rem",
                  color: "#555",
                  marginBottom: "1.5rem",
                }}
              >
                {user.email}
              </p>
              <div>
                <h2
                  style={{
                    fontSize: "1rem",
                    margin: "1rem 0 .6rem",
                    fontWeight: "500",
                  }}
                >
                  Visualizações
                </h2>
                <ul style={{ listStyle: "none" }}>
                  {["atuais", "atrasadas", "realizadas"].map((visualizacao) => (
                    <li
                      key={visualizacao}
                      style={{
                        padding: ".6rem .8rem",
                        width: "100%",
                        boxSizing: "border-box",
                        fontSize: ".9rem",
                        cursor: "pointer",
                        marginBottom: ".4rem",
                        borderRadius: "5px",
                        textTransform: "capitalize",
                        backgroundColor:
                          visualizacao == abaTarefas
                            ? "#86a5c3"
                            : "transparent",
                      }}
                      onClick={() => setAbaTarefas(() => visualizacao as abas)}
                    >
                      {visualizacao}
                    </li>
                  ))}
                </ul>
                <Categorias
                  categorias={categorias}
                  categoriasAtivas={categoriasAtivas}
                  setCategoriasAtivas={setCategoriasAtivas}
                  requisidor={requisidor}
                  setCategorias={setCategorias}
                />
              </div>
            </div>
          </aside>
          <main
            className="campo_tarefas"
            style={{
              flexGrow: "1",
              padding: "0 2rem 2rem",
              height: "100vh",
              overflowY: "scroll",
              boxSizing: "border-box",
              backgroundColor: "#f7f9fa",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.1rem",
                  margin: "1.5rem 0 1rem",
                  fontWeight: "600",
                }}
              >
                Nova Tarefa
              </h2>
              <FormTarefa
                user={user}
                requisidor={requisidor}
                setTarefas={setTarefas}
                setTarefaSelecionada={setTarefaSelecionada}
              />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "1.1rem",
                  margin: "2rem 0 1rem",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                Tarefas {abaTarefas}
              </h2>
              <Tarefas
                tarefas={tarefas}
                categorias={categorias}
                abaTarefas={abaTarefas}
                categoriasAtivas={categoriasAtivas}
                tarefaSelecionada={tarefaSelecionada}
                editarTarefa={editarTarefa}
                setTarefaSelecionada={setTarefaSelecionada}
              />
            </div>
          </main>
          {!!tarefaSelecionada?.id_tarefa && (
            <Editor
              setTarefas={setTarefas}
              setTarefaSelecionada={setTarefaSelecionada}
              requisidor={requisidor}
              editarTarefa={editarTarefa}
              tarefaSelecionada={tarefaSelecionada}
              categorias={categorias}
            />
          )}
        </div>
      )}
    </>
  );
}
