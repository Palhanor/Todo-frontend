// cd .\client\doitask\
// cd .\server\

// TODO: Implementar o Axios para as requisições da API - trocar o fetch nos: user (try catch...)

// TODO: Implementar o Redux para a gestão dos estados => hooks personalizados para descoplamento do sistema

// TODO: Refatorar e otimizar os códigos Front-end do React com boas práticas (memo, useMemo, useCallback)

// TODO: Ajeitar o backend - usar o prisma com modelos das entidades
// TODO: Otimizar as validações de modificação do banco de dados no sistema

// TODO: Usar o eslint junto do prettier para padronização do projeto

// TODO: Ao marcar uma atividade futura como feita ele deve tirar a atividade do futuro e jogar no dia como feita
//        Ai ela fica la e vai para o dia certo depois de virar meia noite? Ou Ja vai direto para o dia atual? E caso ela seja desmarcada?
//        Usar o campo de realizada para inserir no dia que ela foi marcada como precedência sobre a data que foi agendada
// TODO: Adicionar um sistema de pomodoro dentro de cada tarefa separadamente (stateless)
// TODO: Adicionar o sistema de tarefas excluidas (excluir, recuperar e apagar permanentemente)
// TODO: Inserir o campo de horas das tarefas (pode ser nulo) com input especifico para isso
//        Tarefas para realizar ordenadas por hora do prazo (sem prazo vai para cima ordenadas pela hora de criação - antes da prioridades)
//        Tarefas realizadas ordenadas por hora de realização

// TODO: Adicionar as anotações sobre o dia dentro de cada dia consolidado
// TODO: Criar sistema de tarefas perdidas
//        Quando clica em check deve perguntar quando foi realizada: se no mesmo dia, fica como feita, senao, duplica como feita pra o dia que feoi feita e fica como perdida no dia que estava
//        Quando remarca apenas cria uma copia em aberto para o dia e passa a mesma para perdida
// TODO: Adicionar as novas visualizações (histórico e excuídas)
// TODO: Criar sistema de ajuste das visualizações dentro das configurações de usuário
// TODO: Adicionar um campo de 0 a 100 para indicar o quão avançada está a execução daquela tarefa

// TODO: Desenvolver a landing page de apresentaçaõ do sistema
// TODO: Fazer os ajustes de responsividade no sistema (mobile)

// TODO: Fazer o tratamento dos erros no front-end antes de enviar os dados
// TODO: Receber os erros do backend e exibir de uma forma melhorada

import { useCallback, useEffect, useState } from "react";

import Editor from "./Editor";
import Categorias from "./Categorias";
import Tarefas from "./Tarefas";
import FormTarefa from "./FormTarefa";
import Ferramentas from "./Ferramentas";
import Loading from "../Loading";
import Modal from "../../components/modal";

import api from "../../service/api";

import { useRedimensionador } from "../../hooks/redimensionador";

import { filtrarTarefasCategoriasAbas } from "../../utils/tarefas";
import { modalDefault, tarefaDefault } from "../../utils/modelos";

import Tarefa from "../../interfaces/tarefa";
import Categoria from "../../interfaces/categoria";
import { IModal } from "../../interfaces/modal";
import { abas } from "../../interfaces/types";

import "./style.css";

import { FaExclamation } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { useUsuario } from "../../hooks/usuario";

export default function Home() {
  // Sistema de redimensionamento nao consegue ser acessado por outros componentes
  const {
    colEdicao,
    colFerramentas,
    continuarRedimensionamento,
    encerrarRedimensionamento,
    iniciarRedimensionamentoBarraFerramentas,
    iniciarRedimensionamentoEditorTarefa,
    movimentarColunaDireita,
    movimentarColunaEsquerda,
  } = useRedimensionador();
  const { user } = useUsuario();

  // Retornos database
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const listaAbasVisualizacao: abas[] = ["atuais", "atrasadas", "realizadas"];
  // Valores selecionados
  const [tarefaSelecionada, setTarefaSelecionada] =
    useState<Tarefa>(tarefaDefault);
  const [categoriasAtivas, setCategoriasAtivas] = useState<number[]>([]);
  const [abaTarefas, setAbaTarefas] = useState<abas>("atuais");
  // Filtros
  const [filtroTexto, setFiltroTexto] = useState<string>("");
  const [filtroData, setFiltroData] = useState<string>("");
  const [filtroPrioridade, setFiltroPrioridade] = useState<boolean>(false);
  // Modal
  const [exibindoModal, setExibindoModal] = useState<IModal>(modalDefault);

  // CONEXÃO INICIAL COM O BANCO DE DADOS
  useEffect(() => {
    listarTarefas();
    listarCategorias();
  }, []);

  const listarTarefas = useCallback(async (): Promise<void> => {
    try {
      const tokenJWT = localStorage.getItem("auth") || "";
      const { data } = await api.get("/tasks", {
        headers: { "x-access-token": tokenJWT },
      });
      const tarefas: Tarefa[] = data.map((tarefa: Tarefa) => {
        return { ...tarefa, data_final: tarefa.data_final.substring(0, 10) };
      });
      setTarefas(() => tarefas);
    } catch (error: any) {}
  }, [api, setTarefas]);

  const listarCategorias = useCallback(async (): Promise<void> => {
    try {
      const tokenJWT = localStorage.getItem("auth") || "";
      const { data } = await api.get("/category", {
        headers: { "x-access-token": tokenJWT },
      });
      const semCategoriaId = 0;
      const listaIdsCategorias = data.map(
        (retorno: Categoria) => retorno.id_categoria
      );
      setCategorias(() => data);
      setCategoriasAtivas(() => [semCategoriaId, ...listaIdsCategorias]);
    } catch (error) {}
  }, [api, setCategorias, setCategoriasAtivas]);

  // CONEXÃO COM O BANCO DE DADOS (EDIÇÃO)
  const editarTarefa = async (tarefaRecebida: Tarefa): Promise<void> => {
    try {
      const tokenJWT = localStorage.getItem("auth") || "";
      await api.put("tasks", tarefaRecebida, {
        headers: { "x-access-token": tokenJWT },
      });

      setTarefas((tarefas) =>
        tarefas.map((tarefa) =>
          tarefa.id_tarefa == tarefaRecebida.id_tarefa ? tarefaRecebida : tarefa
        )
      );
    } catch (error: any) {
      const result = error.response.data.result;
      alert(result);
    }
  };

  // FERRAMENTAS GERAIS
  const pegarNumeroTarefasVisualizacao = (visualizacao: abas): number => {
    return filtrarTarefasCategoriasAbas(
      tarefas,
      visualizacao,
      categoriasAtivas,
      filtroTexto,
      filtroData,
      filtroPrioridade
    ).length;
  };

  const modificarVisualizacaoTarefas = (aba: abas): void => {
    setAbaTarefas(() => aba);
  };

  // HANDLER DE INPUT
  const handleFiltroTextoValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFiltroTexto(() => e.target.value);
  };

  const limparFiltroTextoValue = (): void => {
    setFiltroTexto(() => "");
  };

  const handleFiltroDataValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFiltroData(() => e.target.value);
  };

  const limparFiltroDataValue = (): void => {
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
                    <div
                      className="p-4 rounded-md bg-white mr-3 cursor-pointer"
                      onClick={() => setFiltroPrioridade((prev) => !prev)}
                    >
                      <FaExclamation
                        size={12}
                        color={filtroPrioridade ? "#FF0000" : "#555"}
                      />
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
