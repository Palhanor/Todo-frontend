import { GrFormClose } from "react-icons/gr";
import { BsTrash3 } from "react-icons/bs";
import Tarefa from "../../../interfaces/tarefa";
import { EditorProps } from "../../../interfaces/props";
import { tarefaDefault } from "../../../utils/modelos";
import { useEffect, useState } from "react";

export default function Editor({
  setTarefas,
  setTarefaSelecionada,
  requisidor,
  editarTarefa,
  encerrarRedimensionamento,
  continuarRedimensionamento,
  setExibindoModal,
  tarefaSelecionada,
  categorias,
  colEdicao,
}: EditorProps) {
  const [selectCategoria, setSelectCategoria] = useState(
    tarefaSelecionada.categoria || ""
  );

  useEffect(() => {
    setSelectCategoria(() => tarefaSelecionada.categoria || "");
  }, [tarefaSelecionada]);

  const excluirTarefa = async (id: number) => {
    const dados = { id_tarefa: id };
    const retorno = await requisidor("tasks", "DELETE", dados);

    if (retorno.result == "Atividade excluída!") {
      setTarefas((current: Tarefa[]) =>
        current.filter((tarefa: Tarefa) => tarefa.id_tarefa !== id)
      );
      setTarefaSelecionada(() => {
        return tarefaDefault;
      });
    } else {
      alert(retorno.result);
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
    editarTarefa(
      {
        ...tarefaSelecionada,
        categoria: id_categoria == 0 ? null : id_categoria,
      },
      "categoria"
    );
  };

  const atualizarTituloTarefaSelecionada = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novaTarefa = {
      ...tarefaSelecionada,
      titulo: e.target.value,
    };
    setTarefaSelecionada(() => novaTarefa);
    editarTarefa(novaTarefa, "dados");
  };

  const editarViewDescricaoTarefaSelecionada = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTarefaSelecionada((atual: Tarefa) => {
      return { ...atual, descricao: e.target.value };
    });
  };

  const atualizarDescricaoTarefaSelecionada = () => {
    editarTarefa(tarefaSelecionada, "dados");
  };

  const atualizarDataTarefaSelecionada = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novaTarefa = {
      ...tarefaSelecionada,
      data_final: e.target.value,
    };
    setTarefaSelecionada(() => novaTarefa);
    editarTarefa(novaTarefa, "dados");
  };

  const style = {
    barraDireita: `bg-[#fcfeff] h-screen p-4 pt-3 box-border`,
    campoSuperior: "flex justify-between items-center my-3",
    fechar: "cursor-pointer",
    selecaoCategoria:
      "p-3 border-none bg-[#e2e9f0] outline-none rounded-md coursor-pointer",
    campoInferior: "w-full",
    tituloData: "flex",
    titulo: "grow py-1 bg-transparent border-none text-base outline-none",
    data: "p-1 bg-transparent border-none outline-none cursor-pointer text-base text-gray-500",
    descricao:
      "w-full h-[70vh] bg-transparent border-none outline-none text-gray-500 resize-none mt-3",
    botao:
      "absolute bottom-8 right-8 cursor-pointer py-3 px-5 bg-[#e23936] border-none rounded-md flex items-center justify-center",
    ilustracao: "ml-2",
  };

  return (
    <div
      className={style.barraDireita}
      style={{
        width: colEdicao,
      }}
      onMouseUp={encerrarRedimensionamento}
      onMouseMove={continuarRedimensionamento}
    >
      <div className={style.campoSuperior}>
        <span className={style.fechar} onClick={removerTarefaSelecionada}>
          <GrFormClose size={32} />
        </span>
        <select
          value={selectCategoria}
          className={style.selecaoCategoria}
          onChange={atualiarCategoriaTarefaSelecionada}
        >
          <option value="0">Sem categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nome_categoria}
            </option>
          ))}
        </select>
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
          <input
            required
            type="date"
            value={tarefaSelecionada.data_final}
            onChange={atualizarDataTarefaSelecionada}
            className={style.data}
          />
        </div>
        <textarea
          cols={30}
          rows={10}
          className={style.descricao}
          value={tarefaSelecionada.descricao}
          onChange={editarViewDescricaoTarefaSelecionada}
          onBlur={atualizarDescricaoTarefaSelecionada}
        ></textarea>
        <div>
          <button
            type="submit"
            className={style.botao}
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
            <BsTrash3 /> <span className={style.ilustracao}>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
