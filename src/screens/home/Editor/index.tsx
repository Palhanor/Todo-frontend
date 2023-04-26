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
  setRedimensionandoFerramentas,
  setRedimensionandoEdicao,
  movimentarColunaEsquerda,
  movimentarColunaDireita,
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

  const style = {
    barraDireita: "bg-[#fcfeff] h-screen p-4 pt-3 box-border",
    campoSuperior: "flex justify-between items-center my-3",
    fechar: "cursor-pointer",
    selecaoCategoria:
      "p-3 border-none bg-[#e2e9f0] outline-none rounded-md coursor-pointer",
    campoInferior: "w-full",
    tituloData: "flex",
    titulo: "grow py-1 bg-transparent border-none text-base outline-none",
    data: "w-32 p-1 bg-transparent border-none outline-none cursor-pointer text-base text-gray-500",
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
      onMouseUp={() => {
        setRedimensionandoFerramentas(() => false);
        setRedimensionandoEdicao(() => false);
      }}
      onMouseMove={(e) => {
        movimentarColunaEsquerda(e);
        movimentarColunaDireita(e);
      }}
    >
      <div className={style.campoSuperior}>
        <span
          className={style.fechar}
          onClick={() =>
            setTarefaSelecionada(() => {
              return tarefaDefault;
            })
          }
        >
          <GrFormClose size={32} />
        </span>
        <select
          value={selectCategoria}
          className={style.selecaoCategoria}
          onChange={(e) =>
            editarTarefa(
              {
                ...tarefaSelecionada,
                categoria:
                  categorias.find(
                    (categoria) =>
                      categoria.id_categoria == Number(e.target.value)
                  )?.id_categoria || null,
              },
              "categoria"
            )
          }
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
            onChange={(e) => {
              setTarefaSelecionada((atual: Tarefa) => {
                return { ...atual, titulo: e.target.value };
              });
              editarTarefa(
                { ...tarefaSelecionada, titulo: e.target.value },
                "dados"
              );
            }}
            className={style.titulo}
          />
          <input
            required
            type="date"
            value={tarefaSelecionada.data_final}
            onChange={(e) => {
              setTarefaSelecionada((atual: Tarefa) => {
                return { ...atual, data_final: e.target.value };
              });
              editarTarefa(
                { ...tarefaSelecionada, data_final: e.target.value },
                "dados"
              );
            }}
            className={style.data}
          />
        </div>
        <textarea
          cols={30}
          rows={10}
          className={style.descricao}
          value={tarefaSelecionada.descricao}
          onChange={(e) => {
            setTarefaSelecionada((atual: Tarefa) => {
              return { ...atual, descricao: e.target.value };
            });
          }}
          onBlur={(e) => {
            editarTarefa(
              { ...tarefaSelecionada, descricao: e.target.value },
              "dados"
            );
          }}
        ></textarea>
        <div>
          <button
            type="submit"
            className={style.botao}
            onClick={() => excluirTarefa(tarefaSelecionada.id_tarefa)}
          >
            <BsTrash3 /> <span className={style.ilustracao}>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
