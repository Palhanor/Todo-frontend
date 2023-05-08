// cd .\client\doitask\
// cd .\server\

// TODO: Salvar dados no local storage (largura das barras laterais)
// TODO: Adicionar o sistema de tarefas excluidas
// TODO: Adicionar um sistema de pomodoro dentro de cada tarefa separadamente (stateless)
// TODO: Ao marcar uma atividade futura como feita ele deve tirar a atividade do futuro e jogar no dia como feita

// TODO: Implementar o Axios para as requisições da API
// TODO: Implementar o Redux para a gestão dos estados
// TODO: Implementar hooks personalizados para descoplamento do sistema

// TODO: Inserir o campo de horas das tarefas (pode ser nulo) com input datetime-local
// TODO: Tarefas para realizar ordenadas por hora e caso não tenha hora, por categoria... Tarefas realizadas ordenadas por hora de realização
// TODO: Adicionar as anotações sobre o dia dentro de cada dia consolidado
// TODO: Criar sistema de tarefas perdidas
//        Quando clica em check deve perguntar quando foi realizada: se no mesmo dia, fica como feita, senao, duplica como feita pra o dia que feoi feita e fica como perdida no dia que estava
//        Quando remarca apenas cria uma copia em aberto para o dia e passa a mesma para perdida

// TODO: Desenvolver a landing page de apresentaçaõ do sistema
// TODO: Fazer os ajustes de responsividade no sistema (mobile)

// TODO: Adicionar um sistema para permitir que o usuário faça anotações sobre o dia que se passou
// TODO: Adicionar as novas visualizações (histórico [perdidas e realizadas], excuídas)
// TODO: Criar sistema de ajuste das visualizações dentro das configurações de usuário
// TODO: Fazer o tratamento dos erros no front-end antes de enviar os dados
// TODO: Receber os erros do backend e exibir de uma forma melhorada
// TODO: Navegar entre as tarefas visualizadas através das teclas (cima e baixo)
// TODO: Adicionar um campo de 0 a 100 para indicar o quão avançada está a execução daquela tarefa

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Editor from "./Editor";
import Categorias from "./Categorias";
import Tarefas from "./Tarefas";
import FormTarefa from "./FormTarefa";
import Ferramentas from "./Ferramentas";
import Loading from "../Loading";
import Modal from "../../components/modal";

import { filtrarTarefasCategoriasAbas } from "../../utils/tarefas";
import { modalDefault, tarefaDefault, userDefault } from "../../utils/modelos";

import Tarefa from "../../interfaces/tarefa";
import Usuario from "../../interfaces/usuario";
import Categoria from "../../interfaces/categoria";
import { IModal } from "../../interfaces/modal";
import { abas, edicaoTarefa } from "../../interfaces/types";

import { GrFormClose } from "react-icons/gr";

import "./style.css";
import { FaExclamation } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  // Pegos do banco de dados
  const [user, setUser] = useState<Usuario>(userDefault);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const listaAbasVisualizacao: abas[] = ["atuais", "atrasadas", "realizadas"];

  // Valores selecionados
  const [tarefaSelecionada, setTarefaSelecionada] =
    useState<Tarefa>(tarefaDefault);
  const [categoriasAtivas, setCategoriasAtivas] = useState<number[]>([]);
  const [abaTarefas, setAbaTarefas] = useState<abas>("atuais");

  // Dimensões das barras laterais
  const larguraTela = window.innerWidth;
  const [colFerramentas, setColFerramentas] = useState<number>(larguraTela / 4);
  const [colEdicao, setColEdicao] = useState<number>(larguraTela / 4);
  const [redimensionandoFerramentas, setRedimensionandoFerramentas] =
    useState<boolean>(false);
  const [redimensionandoEdicao, setRedimensionandoEdicao] =
    useState<boolean>(false);

  // Filtros
  const [filtroTexto, setFiltroTexto] = useState<string>("");
  const [filtroData, setFiltroData] = useState<string>("");
  const [filtroPrioridade, setFiltroPrioridade] = useState<boolean>(false);

  // Modal
  const [exibindoModal, setExibindoModal] = useState<IModal>(modalDefault);

  // ESTRUTURA DAS REQUISIÇÕES
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

  // CONEXÃO INICIAL COM O BANCO DE DADOS
  useEffect(() => {
    configurarUsuario();
    listarTarefas();
    listarCategorias();
  }, []);

  const configurarUsuario = async () => {
    const retorno = await requisidor("user");
    const acessoNegado = retorno.result == "Acesso negado!";
    const tokenInvalido = retorno.result == "Token inválido!";

    if (acessoNegado || tokenInvalido) navigate("/login");
    else setUser(() => retorno.usuario);
  };

  const listarTarefas = async () => {
    const retorno: Tarefa[] = await requisidor("tasks");
    const tarefas: Tarefa[] = retorno.map((tarefa: Tarefa) => {
      return { ...tarefa, data_final: tarefa.data_final.substring(0, 10) };
    });
    setTarefas(() => tarefas);
  };

  const listarCategorias = async () => {
    const retorno: Categoria[] = await requisidor("category");
    const listaIdsCategorias = retorno.map(
      (retorno: Categoria) => retorno.id_categoria
    );
    setCategorias(() => retorno);
    setCategoriasAtivas(() => [0, ...listaIdsCategorias]);
  };

  // CONEXÃO COM O BANCO DE DADOS (EDIÇÃO)
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
      prioridade: tipo == "prioridade" ? +!tarefa.prioridade : +tarefa.prioridade,
    };
    const retorno = await requisidor("tasks", "PUT", dados);

    if (retorno.result == "Atividade atualizada com sucesso!") {
      if (tipo == "check") {
        editarTarefaCheck(tarefa);
      } else if (tipo == "dados") {
        editarTarefaDados(tarefa);
      } else if (tipo == "categoria") {
        editarTarefaCategoria(tarefa);
      } else if (tipo == "prioridade") {
        editarTarefaPrioridade(tarefa);
      }
    } else {
      alert(retorno.result);
    }
  };

  // ACESSÓRIOS PARA EDIÇÃO
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

  const editarTarefaPrioridade = (tarefa: Tarefa) => {
    setTarefas((current: Tarefa[]) =>
      current.map((tarefaAtual: Tarefa) => {
        if (tarefaAtual.id_tarefa == tarefa.id_tarefa)
          return {
            ...tarefaAtual,
            prioridade: +!tarefa.prioridade,
          };
        else return tarefaAtual;
      })
    );
  }

  // FERRAMENTAS GERAIS
  const pegarNumeroTarefasVisualizacao = (nome: abas) => {
    const listaTarefasFiltradas = filtrarTarefasCategoriasAbas(
      tarefas,
      nome,
      categoriasAtivas,
      filtroTexto,
      filtroData,
      filtroPrioridade
    );
    return listaTarefasFiltradas.length;
  };

  const modificarVisualizacaoTarefas = (aba: abas) => {
    setAbaTarefas(() => aba);
  };

  // SISTEMA DE REDIMENSIONAMENTO
  const iniciarRedimensionamentoBarraFerramentas = () => {
    setRedimensionandoFerramentas(() => true);
  };

  const iniciarRedimensionamentoEditorTarefa = () => {
    setRedimensionandoEdicao(() => true);
  };

  const movimentarColunaEsquerda = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (redimensionandoFerramentas) {
      let novaLargura: number;
      if (e.clientX <= larguraTela / 5) novaLargura = larguraTela / 5;
      else if (e.clientX >= larguraTela / 3) novaLargura = larguraTela / 3;
      else novaLargura = e.clientX;
      setColFerramentas(() => novaLargura);
    }
  };

  const movimentarColunaDireita = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (redimensionandoEdicao) {
      const tamanho = larguraTela - e.clientX;
      let novaLargura: number;
      if (tamanho <= larguraTela / 5) novaLargura = larguraTela / 5;
      else if (tamanho >= larguraTela / 2.5) novaLargura = larguraTela / 2.5;
      else novaLargura = tamanho;
      setColEdicao(() => novaLargura);
    }
  };

  const continuarRedimensionamento = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    movimentarColunaEsquerda(e);
    movimentarColunaDireita(e);
  };

  const encerrarRedimensionamento = () => {
    setRedimensionandoFerramentas(() => false);
    setRedimensionandoEdicao(() => false);
  };

  // HANDLER DE INPUT
  const handleFiltroTextoValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroTexto(() => e.target.value);
  };

  const limparFiltroTextoValue = () => {
    setFiltroTexto(() => "");
  };

  const handleFiltroDataValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroData(() => e.target.value);
  };

  const limparFiltroDataValue = () => {
    setFiltroData(() => "");
  };

  // ESTILIZAÇÃO
  const style = {
    tela: "flex",
    barraEsquerda:
      "barra_lateral overflow-y-scroll p-5 pr-4 h-screen box-border justify-between bg-[#e2e9f0]",
    usuario: "flex justify-between items-center",
    nomeUsuario: "text-lg my-2 font-semibold",
    email: "block text-md text-slate-700 mb-4",
    tituloSecao: "text-lg mt-6 mb-3 font-medium",
    listaSecao: "list-none",
    visualizacao:
      "flex justify-between px-3 py-2 w-full box-border text-normal cursor-pointer mb-2 rounded-md capitalize",
    central: `campo_tarefas grow px-5 pb-5 h-screen overflow-y-scroll box-border bg-[#f7f9fa]`,
    titulo: "text-lg mt-5 mb-4 font-semibold",
    redimensionador: (cor: string) =>
      `bg-[${cor}] w-1 h-screen cursor-col-resize`,
  };

  return (
    <>
      {!!user.id_usuario ? (
        <div className={style.tela}>
          <aside
            style={{ width: colFerramentas }}
            className={style.barraEsquerda}
            onMouseUp={encerrarRedimensionamento}
            onMouseMove={continuarRedimensionamento}
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
                  {listaAbasVisualizacao.map((visualizacao) => (
                    <li
                      key={visualizacao}
                      className={style.visualizacao}
                      style={{
                        backgroundColor:
                          visualizacao == abaTarefas
                            ? "#86a5c3"
                            : "transparent",
                      }}
                      onClick={() => modificarVisualizacaoTarefas(visualizacao)}
                    >
                      <span>{visualizacao}</span>
                      <span>
                        {pegarNumeroTarefasVisualizacao(visualizacao)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div>
                  <h2 className={style.tituloSecao}>Filtros</h2>
                  <div className="flex mb-3">
                    <input
                      type="text"
                      placeholder="Filtro textual"
                      value={filtroTexto}
                      onChange={handleFiltroTextoValue}
                      className="rounded-l-md w-full p-3 outline-none"
                    />
                    <span
                      title="Apagar filtro de texto"
                      aria-label="Apagar filtro de texto"
                      onClick={limparFiltroTextoValue}
                      className="w-14 cursor-pointer text-center bg-white rounded-r-md flex items-center justify-center"
                    >
                      <GrFormClose size={20} />
                    </span>
                  </div>
                  <div className="flex">
                    <div className="p-4 rounded-md bg-white mr-3 cursor-pointer" onClick={() => setFiltroPrioridade((prev) => !prev)}>
                      <FaExclamation size={12} color={filtroPrioridade ? "#FF0000" : "#555"} />
                    </div>
                    <input
                      type="date"
                      className="rounded-l-md w-full p-3 outline-none"
                      value={filtroData}
                      onChange={handleFiltroDataValue}
                    />
                    <span
                      title="Apagar filtro de data"
                      aria-label="Apagar filtro de data"
                      onClick={limparFiltroDataValue}
                      className="w-14 cursor-pointer text-center bg-white rounded-r-md flex items-center justify-center"
                    >
                      <GrFormClose size={20} />
                    </span>
                  </div>
                </div>
                <Categorias
                  tarefas={tarefas}
                  categorias={categorias}
                  categoriasAtivas={categoriasAtivas}
                  setCategoriasAtivas={setCategoriasAtivas}
                  requisidor={requisidor}
                  setCategorias={setCategorias}
                  setTarefas={setTarefas}
                  setExibindoModal={setExibindoModal}
                />
              </div>
            </div>
          </aside>
          <div
            className={style.redimensionador("#f7f9fa")}
            onMouseDown={iniciarRedimensionamentoBarraFerramentas}
            onMouseUp={encerrarRedimensionamento}
            onMouseMove={movimentarColunaEsquerda}
          ></div>
          <main
            onMouseUp={encerrarRedimensionamento}
            onMouseMove={continuarRedimensionamento}
            className={style.central}
          >
            <div>
              <h2 className={style.titulo}>Nova Tarefa</h2>
              <FormTarefa
                categorias={categorias}
                tarefaSelecionada={tarefaSelecionada}
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
                filtroTexto={filtroTexto}
                filtroData={filtroData}
                filtroPrioridade={filtroPrioridade}
                editarTarefa={editarTarefa}
                setTarefaSelecionada={setTarefaSelecionada}
              />
            </div>
          </main>
          {!!tarefaSelecionada?.id_tarefa && (
            <>
              <div
                className={style.redimensionador("#fcfeff")}
                onMouseDown={iniciarRedimensionamentoEditorTarefa}
                onMouseUp={encerrarRedimensionamento}
                onMouseMove={movimentarColunaDireita}
              ></div>
              <Editor
                setTarefas={setTarefas}
                setTarefaSelecionada={setTarefaSelecionada}
                requisidor={requisidor}
                editarTarefa={editarTarefa}
                encerrarRedimensionamento={encerrarRedimensionamento}
                continuarRedimensionamento={continuarRedimensionamento}
                setExibindoModal={setExibindoModal}
                tarefaSelecionada={tarefaSelecionada}
                categorias={categorias}
                colEdicao={colEdicao}
              />
            </>
          )}
          {exibindoModal.visivel && (
            <Modal
              exibindoModal={exibindoModal}
              setExibindoModal={setExibindoModal}
            />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
