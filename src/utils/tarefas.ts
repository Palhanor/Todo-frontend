import { pegarDataAtual, pegarDataEspecifica } from "./datas";
import Tarefa from "../interfaces/tarefa";
import { abas } from "../interfaces/types";

const agruparTarefas = (listaTarefas: Tarefa[]) => {
    let objetoDataTarefas: any = {};
    for (let i = 0; i < listaTarefas.length; i++) {
        const tarefa = listaTarefas[i];
        const data = tarefa.data_final;
        if (data in objetoDataTarefas) objetoDataTarefas[data].push(tarefa);
        else objetoDataTarefas[data] = [tarefa];
    }

    const listaDataTarefas = [];
    for (let [key, value] of Object.entries(objetoDataTarefas)) {
        let obj = [key, value];
        listaDataTarefas.push(obj);
    }

    return listaDataTarefas;
};

const ordenarTarefas = (tarefasFiltradas: Tarefa[], abaAtiva: abas) => {
    return tarefasFiltradas.sort((a: Tarefa, b: Tarefa) => {
        if (abaAtiva == "atuais" || abaAtiva == "atrasadas") {
            return (a.data_final > b.data_final) ? 1 : -1;
        } else {
            return (a.data_final < b.data_final) ? 1 : -1;
        };
    });
};

export const filtrarTarefasCategoriasAbas = (
    listaTarefas: Tarefa[],
    abaAtiva: abas,
    categoriasAtivas: number[],
    filtroTexto: string,
    filtroData: string,
) => {
    const dataAtual = pegarDataAtual();
    return listaTarefas
        .filter((tarefa: Tarefa) => {
            return (
                categoriasAtivas.includes(tarefa.categoria as number) ||
                (categoriasAtivas.includes(0) && tarefa.categoria == null)
            );
        })
        .filter((tarefa: Tarefa) => {
            return (tarefa.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                tarefa.descricao.toLowerCase().includes(filtroTexto.toLowerCase())) &&
                (tarefa.data_final == filtroData || filtroData == "")
        })
        .filter((tarefa: Tarefa) => {
            const dataTarefa = pegarDataEspecifica(tarefa.data_final);
            const tarefaAtual = dataTarefa >= dataAtual;
            const tarefaAtrasada =
                dataTarefa < dataAtual && !tarefa.realizada;
            const tarefaRealizada =
                dataTarefa < dataAtual && tarefa.realizada;
            switch (abaAtiva) {
                case "atuais":
                    return tarefaAtual || tarefaAtrasada;
                case "realizadas":
                    return tarefaRealizada;
                case "atrasadas":
                    return tarefaAtrasada;
            }
        });
};

export const filtrarTarefas = (
    listaTarefas: Tarefa[],
    abaAtiva: abas,
    categoriasAtivas: number[],
    filtroTexto: string,
    filtroData: string,
) => {
    const tarefasFiltradas = filtrarTarefasCategoriasAbas(
        listaTarefas,
        abaAtiva,
        categoriasAtivas,
        filtroTexto,
        filtroData,
    );
    const tarefasOrdenadas = ordenarTarefas(tarefasFiltradas, abaAtiva);
    const tarefasAgrupadasEmDias = agruparTarefas(tarefasOrdenadas);
    return tarefasAgrupadasEmDias;
};
