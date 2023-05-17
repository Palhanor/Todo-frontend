import { GrFormClose } from "react-icons/gr";
import Tarefa from "../../../interfaces/tarefa";
import { EditorProps } from "../../../interfaces/props";
import { tarefaDefault } from "../../../utils/modelos";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FaExclamation } from "react-icons/fa";
// import api from "../../../service/api";
import api from "../../../service/api";

export default function Editor({
  setTarefas,
  setTarefaSelecionada,
  editarTarefa,
  encerrarRedimensionamento,
  continuarRedimensionamento,
  setExibindoModal,
  tarefaSelecionada,
  categorias,
  colEdicao,
}: EditorProps) {
  const [selectCategoria, setSelectCategoria] = useState<number>(
    tarefaSelecionada.categoria || 0
  );

  useEffect(() => {
    setSelectCategoria(() => tarefaSelecionada.categoria || 0);
  }, [tarefaSelecionada]);

  const excluirTarefa = async (id: number) => {
    try {
      const tokenJWT = localStorage.getItem("auth") || "";
      await api.delete(`/tasks/${id}`, {
        headers: { "x-access-token": tokenJWT },
      });

      setTarefas((current: Tarefa[]) =>
        current.filter((tarefa: Tarefa) => tarefa.id_tarefa !== id)
      );
      setTarefaSelecionada(() => {
        return tarefaDefault;
      });
    } catch (error: any) {
      const result = error.response.data.result;
      alert(result);
    }
  };

  const disparaExclusaoTarefa = () => {
    const id_tarefa = tarefaSelecionada.id_tarefa;
    excluirTarefa(id_tarefa);
  };

  const removerTarefaSelecionada = () => {
    setTarefaSelecionada(() => {
      return tarefaDefault;
    });
  };

  const atualiarCategoriaTarefaSelecionada = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id_categoria = Number(e.target.value);
    const tarefaEditada = {
      ...tarefaSelecionada,
      categoria: id_categoria == 0 ? null : id_categoria,
    };
    editarTarefa(tarefaEditada);
  };

  const atualiarPrioridadeTarefaSelecionada = () => {
    const tarefaEditada = {
      ...tarefaSelecionada,
      prioridade: +!tarefaSelecionada.prioridade,
    };
    editarTarefa(tarefaEditada);
    setTarefaSelecionada(() => tarefaEditada);
  };

  const atualizarTituloTarefaSelecionada = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novaTarefa = {
      ...tarefaSelecionada,
      titulo: e.target.value,
    };
    setTarefaSelecionada(() => novaTarefa);
    editarTarefa(novaTarefa);
  };

  const editarViewDescricaoTarefaSelecionada = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTarefaSelecionada((atual: Tarefa) => {
      return { ...atual, descricao: e.target.value };
    });
  };

  const atualizarDescricaoTarefaSelecionada = () => {
    editarTarefa(tarefaSelecionada);
  };

  const atualizarDataTarefaSelecionada = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novaTarefa = {
      ...tarefaSelecionada,
      data_final: e.target.value,
    };
    setTarefaSelecionada(() => novaTarefa);
    editarTarefa(novaTarefa);
  };

  const style = {
    barraDireita: `bg-[#fcfeff] h-screen p-4 pt-3 box-border relative`,
    campoSuperior: "flex items-center gap-3 mt-3 mb-5",
    fechar: "cursor-pointer rounded-md bg-[#e2e9f0] p-2",
    apagar: "cursor-pointer rounded-md p-3 bg-transparent hover:bg-[#EC6E6E]",
    ferramentas: "bg-[#e2e9f0] flex items-center rounded-md mb-4",
    data: "grow p-3 bg-transparent border border-solid border-r-gray-300 rounded-l-md outline-none cursor-pointer text-base text-gray-700",
    selecaoCategoria:
      "grow p-3 border-none bg-transparent outline-none cursor-pointer text-gray-700 text-base coursor-pointer",
    campoInferior: "w-full",
    tituloData: "flex",
    titulo: "grow py-1 bg-transparent border-none text-xl outline-none",
    descricao:
      "w-full h-[65vh] bg-transparent border-none outline-none text-lg text-gray-700 resize-none mt-3",
    botao:
      "absolute bottom-8 right-8 cursor-pointer py-3 px-5 bg-[#e23936] border-none rounded-md flex items-center justify-center",
    ilustracao: "ml-2",
  };

  return (
    <div
      className={style.barraDireita}
      style={{ width: colEdicao }}
      onMouseUp={encerrarRedimensionamento}
      onMouseMove={continuarRedimensionamento}
    >
      <div className={style.campoSuperior}>
        <span
          title="Fechar editor"
          aria-label="Fechar editor"
          className={style.fechar}
          onClick={removerTarefaSelecionada}
        >
          <GrFormClose size={18} />
        </span>
      </div>
      <div className={style.ferramentas}>
        <input
          required
          type="date"
          value={tarefaSelecionada.data_final}
          onChange={atualizarDataTarefaSelecionada}
          className={style.data}
        />
        <select
          value={selectCategoria}
          className={style.selecaoCategoria}
          onChange={atualiarCategoriaTarefaSelecionada}
        >
          <option value={0}>Sem categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nome_categoria}
            </option>
          ))}
        </select>
        <div
          className="py-5 px-5 border border-solid border-l-gray-300 cursor-pointer rounded-r-md"
          onClick={atualiarPrioridadeTarefaSelecionada}
        >
          <FaExclamation
            size={14}
            color={tarefaSelecionada.prioridade ? "#FF0000" : "#555"}
          />
        </div>
      </div>
      <div className={style.campoInferior}>
        <div className={style.tituloData}>
          <input
            required
            type="text"
            placeholder="Edite o titulo da tarefa"
            value={tarefaSelecionada.titulo}
            onChange={atualizarTituloTarefaSelecionada}
            className={style.titulo}
          />
        </div>
        <textarea
          cols={30}
          rows={10}
          placeholder="Escreva uma descrição desta tarefa aqui..."
          className={style.descricao}
          value={tarefaSelecionada.descricao}
          onChange={editarViewDescricaoTarefaSelecionada}
          onBlur={atualizarDescricaoTarefaSelecionada}
        ></textarea>
      </div>
      <div className="flex items-center gap-3 justify-end bg-[#e2e9f0] p-2 absolute bottom-7 left-4 right-4 rounded-md box-border">
        <button
          title="Apagar tarefa"
          aria-label="Apagar tarefa"
          className={style.apagar}
          onClick={() =>
            setExibindoModal(() => {
              return {
                visivel: true,
                titulo: `Excluir tarefa: ${tarefaSelecionada.titulo}`,
                descricao:
                  "Após realizar esta operação não será mais possível recuperar a tarefa em questão. Você tem certeza que deseja excluí-la?",
                confirmacao: disparaExclusaoTarefa,
              };
            })
          }
        >
          <BiTrash size={18} />
        </button>
      </div>
    </div>
  );
}
