import { BsFileText } from "react-icons/bs";
import { filtrarTarefas } from "../../../utils/tarefas";
import { TarefasProps } from "../../../interfaces/props";
import Tarefa from "../../../interfaces/tarefa";
import { tarefaDefault } from "../../../utils/modelos";
import { FaExclamation } from "react-icons/fa";
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
  filtroTexto,
  filtroData,
  filtroPrioridade,
  editarTarefa,
  setTarefaSelecionada,
}: TarefasProps) {
  const tarefasRealizadasNoFinal = (listaTarefas: Tarefa[]) => {
    const tarefasRealizadas = listaTarefas.filter(
      (tarefa) => tarefa.realizada == 1
    );
    const tarefasPendentes = listaTarefas.filter(
      (tarefa) => tarefa.realizada == 0
    );

    const tarefasRealizadasOrdenadas = tarefasRealizadas.sort(
      (a: Tarefa, b: Tarefa) => (a.prioridade < b.prioridade ? 1 : -1)
    );
    const tarefasPendentesOrdenadas = tarefasPendentes.sort(
      (a: Tarefa, b: Tarefa) => (a.prioridade < b.prioridade ? 1 : -1)
    );

    return [...tarefasPendentesOrdenadas, ...tarefasRealizadasOrdenadas];
  };

  const selecionarTarefaAbrirEditor = (tarefa: Tarefa) => {
    setTarefaSelecionada((tarefaAnterior) => {
      return tarefaAnterior.id_tarefa == tarefa.id_tarefa
        ? tarefaDefault
        : tarefa;
    });
  };

  const checkTarefa = (
    e: React.ChangeEvent<HTMLInputElement>,
    tarefa: Tarefa
  ) => {
    e.stopPropagation;
    const tarefaEditada: Tarefa = {
      ...tarefa,
      realizada: +!tarefa.realizada,
    };
    editarTarefa(tarefaEditada);
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
    informacoes: "flex items-center gap-2",
    data: "text-sm text-gray-400",
  };

  return (
    <ul className={style.lista}>
      {filtrarTarefas(
        tarefas,
        abaTarefas,
        categoriasAtivas,
        filtroTexto,
        filtroData,
        filtroPrioridade
      ).map((dataTarefas: any) => (
        <li key={dataTarefas[0]}>
          <details open={true} className={style.toggle}>
            <summary className={style.tituloData}>
              {formatarDataPrincipal(dataTarefas[0])} &#8226;{" "}
              {dataTarefas[1].length}
            </summary>
            <ul>
              {tarefasRealizadasNoFinal(dataTarefas[1]).map(
                (tarefa: Tarefa) => (
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
                        checked={!!tarefa.realizada}
                        onChange={(e) => checkTarefa(e, tarefa)}
                        className={style.check}
                      />
                    </div>
                    <div
                      onClick={() => selecionarTarefaAbrirEditor(tarefa)}
                      className={style.nomeContainer}
                    >
                      <h3
                        className={
                          style.nome +
                          ` ${
                            tarefa.realizada
                              ? "line-through text-gray-500"
                              : tarefa.data_final < pegarDataAtual()
                              ? "text-red-700"
                              : ""
                          }`
                        }
                      >
                        {tarefa.titulo}
                      </h3>
                      <div className={style.informacoes}>
                        {!!tarefa.prioridade && (
                          <FaExclamation size={12} color="#FF0000" />
                        )}
                        {tarefa.descricao && (
                          <BsFileText size={16} color="#9ca3af" />
                        )}
                        <span className={style.data}>
                          {formatarData(tarefa.data_final)}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          </details>
        </li>
      ))}
    </ul>
  );
}
