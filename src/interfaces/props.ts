import { abas, edicaoTarefa } from "./types";
import Categoria from "./categoria";
import Tarefa from "./tarefa";
import Usuario from "./usuario";

export interface EditorProps {
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    editarTarefa: (tarefa: Tarefa, tipo: edicaoTarefa) => Promise<void>;
    tarefaSelecionada: Tarefa;
    categorias: Categoria[];
}

export interface CategoriasProps {
    categorias: Categoria[];
    categoriasAtivas: number[];
    setCategoriasAtivas: React.Dispatch<React.SetStateAction<number[]>>;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export interface TarefasProps {
    categorias: Categoria[];
    categoriasAtivas: number[];
    tarefas: Tarefa[];
    abaTarefas: abas;
    tarefaSelecionada: Tarefa;
    editarTarefa: (tarefa: Tarefa, tipo: edicaoTarefa) => Promise<void>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
}

export interface FormTarefaProps {
    user: Usuario;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
}