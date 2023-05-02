import { abas, edicaoTarefa } from "./types";
import Categoria from "./categoria";
import Tarefa from "./tarefa";
import Usuario from "./usuario";
import ICategoria from "./categoria";
import { IModal } from "./modal";

export interface EditorProps {
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    editarTarefa: (tarefa: Tarefa, tipo: edicaoTarefa) => Promise<void>;
    encerrarRedimensionamento: () => void
    continuarRedimensionamento: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    setExibindoModal: React.Dispatch<React.SetStateAction<IModal>>;
    tarefaSelecionada: Tarefa;
    categorias: Categoria[];
    colEdicao: number;
}

export interface CategoriasProps {
    tarefas: Tarefa[];
    categorias: Categoria[];
    categoriasAtivas: number[];
    setCategoriasAtivas: React.Dispatch<React.SetStateAction<number[]>>;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
    setExibindoModal: React.Dispatch<React.SetStateAction<IModal>>;
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
    categorias: Categoria[];
    tarefaSelecionada: Tarefa;
    user: Usuario;
    requisidor: (rota: string, metodo?: string, dados?: any) => Promise<any>;
    setTarefas: React.Dispatch<React.SetStateAction<Tarefa[]>>;
    setTarefaSelecionada: React.Dispatch<React.SetStateAction<Tarefa>>;
}

export interface CategoriaProps {
    tarefas: Tarefa[];
    categoria: ICategoria;
    categoriasAtivas: number[];
    selecionarCategoria: (categoria: number) => void;
    edicaoCategoria: ICategoria;
    controlarEdicaoCategoria: (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        categoria: ICategoria
    ) => void;
    editarCategoria: (categoria: ICategoria) => Promise<void>;
    excluirCategoria: (id: number) => Promise<void>;
    setExibindoModal: React.Dispatch<React.SetStateAction<IModal>>;
}

export interface ModalProps {
    exibindoModal: IModal;
    setExibindoModal: React.Dispatch<React.SetStateAction<IModal>>;
}