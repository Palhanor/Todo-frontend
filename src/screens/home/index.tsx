// TODO: Criar um load para quando estiver esperando autenticacao
// TODO: Adicionar o sistema para visualizar a senha inserida

// TODO: Implementar um filtro de busca por termos - acima de visualizações
// TODO: Implementar um filtro por prazos (dia especifico) - acima de visualizações
// TODO: Implementar um limpador do filtro de prazos (dia especifico) - acima de visualizações

// TODO: Ajeitar a tela de configuracoes de usuario (dados, senha, apagar...)
// TODO: Trabalhar nas paginas que faltam: erro e landingPage

// TODO: Fazer os ajustes de responsividade no sistema

// TODO: Fazer o tratamento dos erros no front-end antes de enviar os dados
// TODO: Receber os erros do backend e exibir de uma forma melhorada

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
import { filtrarTarefasCategoriasAbas } from "../../utils/tarefas";

export default function Home() {
  const [user, setUser] = useState<Usuario>(userDefault);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [tarefaSelecionada, setTarefaSelecionada] =
    useState<Tarefa>(tarefaDefault);
  const [categoriasAtivas, setCategoriasAtivas] = useState<number[]>([]);
  const [abaTarefas, setAbaTarefas] = useState<abas>("atuais");

  const [colFerramentas, setColFerramentas] = useState<number>(
    window.innerWidth / 4
  );
  const [redimensionandoFerramentas, setRedimensionandoFerramentas] =
    useState<boolean>(false);

  const [colEdicao, setColEdicao] = useState<number>(window.innerWidth / 4);
  const [redimensionandoEdicao, setRedimensionandoEdicao] =
    useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    configurarUsuario();
    listarTarefas();
    listarCategorias();
  }, []);

  const movimentarColunaEsquerda = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (redimensionandoFerramentas) {
      const screenWidth = window.innerWidth;
      let novaLargura: number;
      if (e.clientX <= screenWidth / 5) novaLargura = screenWidth / 5;
      else if (e.clientX >= screenWidth / 3) novaLargura = screenWidth / 3;
      else novaLargura = e.clientX;
      setColFerramentas(() => novaLargura);
    }
  };

  const movimentarColunaDireita = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (redimensionandoEdicao) {
      const screenWidth = window.innerWidth;
      const tamanho = screenWidth - e.clientX;
      let novaLargura: number;
      if (tamanho <= screenWidth / 5) novaLargura = screenWidth / 5;
      else if (tamanho >= screenWidth / 3) novaLargura = screenWidth / 3;
      else novaLargura = tamanho;
      setColEdicao(() => novaLargura);
    }
  };

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

  const style = {
    tela: "flex",
    barraEsquerda: "p-5 pr-4 h-screen box-border justify-between bg-[#e2e9f0]",
    usuario: "flex justify-between items-center",
    nomeUsuario: "text-lg my-2 font-semibold",
    email: "block text-md text-slate-700 mb-4",
    tituloSecao: "text-md mt-4 mb-3 font-normal",
    listaSecao: "list-none",
    visualizacao:
      "flex justify-between px-3 py-2 w-full box-border text-normal cursor-pointer mb-2 rounded-md capitalize",
    central:
      "campo_tarefas grow px-5 pb-5 h-screen overflow-y-scroll box-border bg-[#f7f9fa]",
    titulo: "text-lg mt-5 mb-4 font-semibold",
    redimensionador: (cor: string) =>
      `bg-[${cor}] w-1 h-screen cursor-col-resize`,
  };

  const pegarNumeroTarefasVisualizacao = (nome: abas) => {
    const listaTarefasFiltradas = filtrarTarefasCategoriasAbas(
      tarefas,
      nome,
      categoriasAtivas
    );
    return listaTarefasFiltradas.length;
  };

  return (
    <>
      {!!user.id_usuario && (
        <div className={style.tela}>
          <aside
            style={{ width: colFerramentas }}
            className={style.barraEsquerda}
            onMouseUp={() => {
              setRedimensionandoFerramentas(() => false);
              setRedimensionandoEdicao(() => false);
            }}
            onMouseMove={(e) => {
              movimentarColunaEsquerda(e);
              movimentarColunaDireita(e);
            }}
          >
            <div>
              <div className={style.usuario}>
                <h1 className={style.nomeUsuario}>{user.nome}</h1>
                <Ferramentas />
              </div>
              <p className={style.email}>{user.email}</p>
              <div>
                <h2 className={style.tituloSecao}>Visualizações</h2>
                <ul className={style.listaSecao}>
                  {["atuais", "atrasadas", "realizadas"].map((visualizacao) => (
                    <li
                      key={visualizacao}
                      className={style.visualizacao}
                      style={{
                        backgroundColor:
                          visualizacao == abaTarefas
                            ? "#86a5c3"
                            : "transparent",
                      }}
                      onClick={() => setAbaTarefas(() => visualizacao as abas)}
                    >
                      <span>{visualizacao}</span>
                      <span>
                        {pegarNumeroTarefasVisualizacao(visualizacao as abas)}
                      </span>
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
          <div
            className={style.redimensionador("#e2e9f0")}
            onMouseDown={() => {
              setRedimensionandoFerramentas(() => true);
            }}
            onMouseUp={() => setRedimensionandoFerramentas(() => false)}
            onMouseMove={movimentarColunaEsquerda}
          ></div>
          <main
            onMouseUp={() => {
              setRedimensionandoFerramentas(() => false);
              setRedimensionandoEdicao(() => false);
            }}
            onMouseMove={(e) => {
              movimentarColunaEsquerda(e);
              movimentarColunaDireita(e);
            }}
            className={style.central}
          >
            <div>
              <h2 className={style.titulo}>Nova Tarefa</h2>
              <FormTarefa
                user={user}
                requisidor={requisidor}
                setTarefas={setTarefas}
                setTarefaSelecionada={setTarefaSelecionada}
              />
            </div>
            <div>
              <h2 className={style.titulo}>Tarefas {abaTarefas}</h2>
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
            <>
              <div
                className={style.redimensionador("#fcfeff")}
                onMouseDown={() => {
                  setRedimensionandoEdicao(() => true);
                }}
                onMouseUp={() => setRedimensionandoEdicao(() => false)}
                onMouseMove={movimentarColunaDireita}
              ></div>
              <Editor
                setTarefas={setTarefas}
                setTarefaSelecionada={setTarefaSelecionada}
                requisidor={requisidor}
                editarTarefa={editarTarefa}
                setRedimensionandoFerramentas={setRedimensionandoFerramentas}
                setRedimensionandoEdicao={setRedimensionandoEdicao}
                movimentarColunaEsquerda={movimentarColunaEsquerda}
                movimentarColunaDireita={movimentarColunaDireita}
                tarefaSelecionada={tarefaSelecionada}
                categorias={categorias}
                colEdicao={colEdicao}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
