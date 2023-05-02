import { AiFillEdit } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { BsCheck } from "react-icons/bs";
import Tarefa from "../../../../interfaces/tarefa";
import { CategoriaProps } from "../../../../interfaces/props";
import "../style.css";

export default function Categoria({
  tarefas,
  categoria,
  categoriasAtivas,
  edicaoCategoria,
  selecionarCategoria,
  controlarEdicaoCategoria,
  editarCategoria,
  excluirCategoria,
  setExibindoModal,
}: CategoriaProps) {
  const [exibindoEdicao, setExibindoEdicao] = useState<boolean>(false);
  const [nomeEdicaoCategoria, setNomeEdicaoCategoria] = useState<string>("");
  const [corEdicaoCategoria, setCorEdicaoCategoria] = useState<string>("");

  useEffect(() => {
    if (edicaoCategoria.id_categoria) {
      setNomeEdicaoCategoria(() => edicaoCategoria.nome_categoria);
      setCorEdicaoCategoria(() => edicaoCategoria.cor);
    }
  }, [edicaoCategoria.id_categoria]);

  const dispararEdicaoCategoria = () => {
    const categoriaEditada = {
      id_categoria: edicaoCategoria.id_categoria,
      nome_categoria: nomeEdicaoCategoria,
      cor: corEdicaoCategoria,
    };
    editarCategoria(categoriaEditada);
  };

  const dispararExclusaoCategoria = () => {
    const id_categoria = edicaoCategoria.id_categoria;
    excluirCategoria(id_categoria);
  };

  const quantidadeTarefasCategoria = (id_categoria: number) => {
    return tarefas.filter((tarefa: Tarefa) => tarefa.categoria == id_categoria)
      .length;
  };

  const style = {
    bordaCategoria:
      "p-0.5 pl-2 w-full box-border text-base cursor-pointer mb-3 rounded-md capitalize",
    categoria: "flex justify-between items-center p-3 rounded-md",
    tituloCategoria: "text-small font-medium",
  };

  return (
    <li
      className={style.bordaCategoria}
      style={{
        backgroundColor: categoria.cor,
      }}
      onClick={() => {
        if (!edicaoCategoria.id_categoria) {
          selecionarCategoria(categoria.id_categoria);
        }
      }}
      onMouseEnter={() => setExibindoEdicao(() => true)}
      onMouseLeave={() => {
        if (edicaoCategoria.id_categoria != categoria.id_categoria) {
          setExibindoEdicao(() => false);
        }
      }}
    >
      <div
        className={style.categoria}
        style={{
          backgroundColor: categoriasAtivas.includes(categoria.id_categoria)
            ? categoria.cor
            : "#e2e9f0",
        }}
      >
        {categoria.id_categoria &&
        edicaoCategoria.id_categoria == categoria.id_categoria ? (
          <>
            <input
              className="inputCor border border-solid border-black rounded-md"
              type="color"
              value={corEdicaoCategoria}
              onChange={(e) => setCorEdicaoCategoria(() => e.target.value)}
            />
            <input
              className="border border-solid border-black outline-none rounded-md p-1 mx-3 w-4/6"
              style={{ backgroundColor: categoria.cor }}
              type="text"
              value={nomeEdicaoCategoria}
              onChange={(e) => {
                setNomeEdicaoCategoria(() => e.target.value);
              }}
            />
          </>
        ) : (
          <h4 className={style.tituloCategoria}>
            {categoria.nome_categoria
              ? categoria.nome_categoria
              : "Sem categoria"}
          </h4>
        )}
        {!!categoria.id_categoria && exibindoEdicao ? (
          <span>
            {edicaoCategoria.id_categoria != categoria.id_categoria ? (
              <span onClick={(e) => controlarEdicaoCategoria(e, categoria)}>
                <AiFillEdit />
              </span>
            ) : (
              <div className="flex gap-2 items-center">
                <span onClick={dispararEdicaoCategoria}>
                  <BsCheck size={20} />
                </span>
                <span onClick={(e) => controlarEdicaoCategoria(e, categoria)}>
                  <GrFormClose size={20} />
                </span>
                <span
                  onClick={() =>
                    setExibindoModal(() => {
                      return {
                        visivel: true,
                        titulo: `Excluir categoria: ${categoria.nome_categoria}`,
                        descricao:
                          "Esta ação não poderá ser revertida após realizada. Você tem certeza que deseja ecluir esta categoria?",
                        confirmacao: dispararExclusaoCategoria,
                      };
                    })
                  }
                >
                  <FiTrash2 size={16} />
                </span>
              </div>
            )}
          </span>
        ) : (
          <span>{quantidadeTarefasCategoria(categoria.id_categoria)}</span>
        )}
      </div>
    </li>
  );
}
