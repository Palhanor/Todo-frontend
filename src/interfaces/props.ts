import { abas, edicaoTarefa } from "./types";
import Categoria from "./categoria";
import Tarefa from "./tarefa";
import Usuario from "./usuario";

export interface EditorProps {
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    editarTarefa: (tarefa: Tarefa, tipo: edicaoTarefa) => Promise<void>;
    setRedimensionandoFerramentas: React.Dispatch<React.SetStateAction<boolean>>,
    setRedimensionandoEdicao: React.Dispatch<React.SetStateAction<boolean>>,
    movimentarColunaEsquerda: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    movimentarColunaDireita: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    tarefaSelecionada: Tarefa;
    categorias: Categoria[];
    colEdicao: number;
}

export interface CategoriasProps {
    categorias: Categoria[];
    categoriasAtivas: number[];
    setCategoriasAtivas: React.Dispatch<React.SetStateAction<number[]>>;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
}

export interface TarefasProps {
    categorias: Categoria[];
    categoriasAtivas: number[];
    tarefas: Tarefa[];
    abaTarefas: abas;
    tarefaSelecionada: Tarefa;
    filtroTexto: string;
    filtroData: string;
    editarTarefa: (tarefa: Tarefa, tipo: edicaoTarefa) => Promise<void>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
}

export interface FormTarefaProps {
    user: Usuario;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
}