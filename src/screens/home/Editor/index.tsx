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
  tarefaSelecionada,
  categorias,
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

  return (
    <div
      style={{
        width: "30vw",
        // width: "35vw",
        backgroundColor: "#fcfeff",
        height: "100vh",
        padding: "1rem 2rem 2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <span
          style={{ cursor: "pointer" }}
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
          style={{
            padding: ".6rem",
            border: "none",
            backgroundColor: "#e2e9f0",
            outline: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
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
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex" }}>
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
            style={{
              flexGrow: "1",
              padding: ".2rem 0",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.1rem",
              outline: "none",
            }}
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
            style={{
              width: "8rem",
              padding: ".2rem",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              cursor: "pointer",
              fontSize: ".9rem",
            }}
          />
        </div>
        <textarea
          cols={30}
          rows={10}
          style={{
            width: "100%",
            height: "70vh",
            backgroundColor: "transparent",
            border: "none",
            resize: "none",
            color: "#444",
            outline: "none",
            marginTop: ".8rem",
          }}
          value={tarefaSelecionada.descricao}
          onChange={(e) => {
            setTarefaSelecionada((atual: Tarefa) => {
              return { ...atual, descricao: e.target.value };
            });
            editarTarefa(
              { ...tarefaSelecionada, descricao: e.target.value },
              "dados"
            );
          }}
        ></textarea>
        <div>
          <button
            type="submit"
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2rem",
              cursor: "pointer",
              padding: ".8rem 1.2rem",
              backgroundColor: "#e23936",
              border: "none",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => excluirTarefa(tarefaSelecionada.id_tarefa)}
          >
            <BsTrash3 /> <span style={{ marginLeft: ".4rem" }}>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
