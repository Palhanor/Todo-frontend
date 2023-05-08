export default interface Tarefa {
    id_tarefa: number;
    titulo: string;
    descricao: string;
    data_final: string;
    categoria: number | null;
    realizada: number;
    prioridade: number;
    // excluida: {
    //     data: number[];
    // };

}
