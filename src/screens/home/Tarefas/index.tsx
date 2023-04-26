import { BsFileText } from "react-icons/bs";
import { filtrarTarefas } from "../../../utils/tarefas";
import { TarefasProps } from "../../../interfaces/props";
import Tarefa from "../../../interfaces/tarefa";
import {
  formatarData,
  formatarDataPrincipal,
  pegarDataAtual,
} from "../../../utils/datas";
import { tarefaDefault } from "../../../utils/modelos";

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
    <ul className="list-none p-0 m-0">
      {filtrarTarefas(tarefas, abaTarefas, categoriasAtivas).map((val: any) => (
        <li key={val[0]}>
          <details open={true} style={{ cursor: "pointer" }}>
            <summary className="text-base color-gray-700 mt-7 mb-4 font-semibold">
              {formatarDataPrincipal(val[0])} &#8226; {val[1].length}
            </summary>
            <ul>
              {val[1].map((tarefa: Tarefa) => (
                <li
                  key={tarefa.id_tarefa}
                  className="flex justify-between items-center cursor-pointer"
                  style={{
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
                      className="w-4 h-4 cursor-pointer m-4"
                    />
                  </div>
                  <div
                    onClick={() =>
                      setTarefaSelecionada((tarefaAnterior) => {
                        return tarefaAnterior.id_tarefa == tarefa.id_tarefa
                          ? tarefaDefault
                          : tarefa;
                      })
                    }
                    className="flex items-center justify-between grow p-4 pl-0 border-b border-solid border-gray-300"
                  >
                    <h3
                      className="inline-block text-base mx-3 font-normal"
                      style={{
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
                    <div className="flex items-center">
                      {tarefa.descricao && <BsFileText size={16} />}
                      <span className="text-sm text-gray-400 ml-3">
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
