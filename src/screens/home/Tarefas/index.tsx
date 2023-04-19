import { BsFileText } from "react-icons/bs";
import { filtrarTarefas } from "../../../utils/tarefas";
import { TarefasProps } from "../../../interfaces/props";
import Tarefa from "../../../interfaces/tarefa";
import {
  formatarData,
  formatarDataPrincipal,
  pegarDataAtual,
} from "../../../utils/datas";

export default function Tarefas({
  tarefas,
  categorias,
  abaTarefas,
  categoriasAtivas,
  tarefaSelecionada,
  editarTarefa,
  setTarefaSelecionada,
}: TarefasProps) {
  return (
    <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
      {filtrarTarefas(tarefas, abaTarefas, categoriasAtivas).map((val: any) => (
        <li key={val[0]}>
          <details open={true} style={{ cursor: "pointer" }}>
            <summary
              style={{
                fontSize: ".9rem",
                color: "#222",
                margin: "1.5rem 0 .6rem",
                fontWeight: "600",
              }}
            >
              {formatarDataPrincipal(val[0])} &#8226; {val[1].length}
            </summary>
            <ul>
              {val[1].map((tarefa: Tarefa) => (
                <li
                  key={tarefa.id_tarefa}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor:
                      tarefa.id_tarefa === tarefaSelecionada.id_tarefa
                        ? "#ebeff5"
                        : "transparent",
                    borderLeft: `4px solid #${
                      tarefa.categoria
                        ? categorias.find(
                            (categoria) =>
                              categoria.id_categoria == tarefa.categoria
                          )?.cor
                        : "f7f9fa"
                    }`,
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      id="tarefas"
                      checked={!!tarefa.realizada}
                      onChange={() => editarTarefa(tarefa, "check")}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        margin: "1rem",
                      }}
                    />
                  </div>
                  <div
                    onClick={() => setTarefaSelecionada(() => tarefa)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid lightgray",
                      flexGrow: "1",
                      padding: "1rem 1rem 1rem 0",
                    }}
                  >
                    <h3
                      style={{
                        display: "inline-block",
                        fontSize: "1rem",
                        margin: "0 .5rem",
                        fontWeight: "normal",
                        textDecoration: tarefa.realizada
                          ? "line-through"
                          : "none",
                        color: tarefa.realizada
                          ? "#999"
                          : tarefa.data_final < pegarDataAtual()
                          ? "#d02424"
                          : "black",
                      }}
                    >
                      {tarefa.titulo}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {tarefa.descricao && <BsFileText size={16} />}
                      <span
                        style={{
                          fontSize: ".8rem",
                          color: "#666666",
                          marginLeft: ".6rem",
                        }}
                      >
                        {formatarData(tarefa.data_final)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ul>
  );
}
