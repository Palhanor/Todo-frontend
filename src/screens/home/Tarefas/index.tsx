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
  filtroTexto,
  filtroData,
  editarTarefa,
  setTarefaSelecionada,
}: TarefasProps) {
  const tarefasRealizadasNoFinal = (listaTarefas: Tarefa[]) => {
    return listaTarefas.sort((a: Tarefa, b: Tarefa) =>
      a.realizada > b.realizada ? 1 : -1
    );
  };

  const style = {
    lista: "list-none p-0 m-0",
    toggle: "cursor-pointer",
    tituloData: "text-base color-gray-700 mt-7 mb-4 font-semibold",
    tarefa: "flex justify-between items-center cursor-pointer",
    check: "w-4 h-4 cursor-pointer m-4",
    nomeContainer:
      "flex items-center justify-between grow p-4 pl-0 border-b border-solid border-gray-300",
    nome: "inline-block text-base mx-3 font-normal",
    informacoes: "flex items-center",
    data: "text-sm text-gray-400 ml-3",
  };

  return (
    <ul className={style.lista}>
      {filtrarTarefas(
        tarefas,
        abaTarefas,
        categoriasAtivas,
        filtroTexto,
        filtroData
      ).map((val: any) => (
        <li key={val[0]}>
          <details open={true} className={style.toggle}>
            <summary className={style.tituloData}>
              {formatarDataPrincipal(val[0])} &#8226; {val[1].length}
            </summary>
            <ul>
              {tarefasRealizadasNoFinal(val[1]).map((tarefa: Tarefa) => (
                <li
                  key={tarefa.id_tarefa}
                  className={style.tarefa}
                  style={{
                    backgroundColor:
                      tarefa.id_tarefa === tarefaSelecionada.id_tarefa
                        ? "#ebeff5"
                        : "transparent",
                    borderLeft: `4px solid ${
                      tarefa.categoria
                        ? categorias.find(
                            (categoria) =>
                              categoria.id_categoria == tarefa.categoria
                          )?.cor
                        : "#f7f9fa"
                    }`,
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      id="tarefas"
                      checked={!!tarefa.realizada}
                      onChange={() => editarTarefa(tarefa, "check")}
                      className={style.check}
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
                    className={style.nomeContainer}
                  >
                    <h3
                      className={style.nome}
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
                    <div className={style.informacoes}>
                      {tarefa.descricao && <BsFileText size={16} />}
                      <span className={style.data}>
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
