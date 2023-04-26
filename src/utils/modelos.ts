import Categoria from "../interfaces/categoria";
import Tarefa from "../interfaces/tarefa";
import Usuario from "../interfaces/usuario";

export const tarefaDefault: Tarefa = {
    id_tarefa: 0,
    titulo: "",
    descricao: "",
    data_final: "",
    categoria: null,
    realizada: 0,
};

export const userDefault: Usuario = {
    id_usuario: 0,
    nome: "",
    email: "",
};

export const categoriaDefault: Categoria = {
    id_categoria: 0,
    nome_categoria: "",
    cor: "#86a5c3",
};