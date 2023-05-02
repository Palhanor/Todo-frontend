export interface IModal {
    visivel: boolean,
    titulo: string,
    descricao: string,
    confirmacao: () => void
}