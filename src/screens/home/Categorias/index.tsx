import { useEffect, useState } from "react";
import Categoria from "../../../interfaces/categoria";
import { CategoriasProps } from "../../../interfaces/props";
import { categoriaDefault } from "../../../utils/modelos";
import { AiFillEdit } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import {
  BiPlusCircle,
  BiMinusCircle,
  BiCheckboxMinus,
  BiCheckboxChecked,
} from "react-icons/bi";
import "./style.css";

export default function Categorias({
  categorias,
  categoriasAtivas,
  setCategoriasAtivas,
  requisidor,
  setCategorias,
  setTarefas,
}: CategoriasProps) {
  const [novaCategoria, setNovaCategoria] = useState(false);
  const [edicaoCategoria, setEdicaoCategoria] =
    useState<Categoria>(categoriaDefault);

  const [nomeCategoria, setNomeCategoria] = useState("");
  const [corCategoria, setCorCategoria] = useState("#86a5c3");

  const [mostrarFerramentas, setMostrarFerramentas] = useState<boolean>(false);

  useEffect(() => {
    if (edicaoCategoria) {
      setNomeCategoria(() => edicaoCategoria.nome_categoria);
      setCorCategoria(() => edicaoCategoria.cor);
    } else {
      setNomeCategoria(() => "");
      setCorCategoria(() => "#86a5c3");
    }
  }, [edicaoCategoria]);

  const selecaoCategoria = (categoria: number) => {
    const categoriaSelecionada = categoriasAtivas.includes(categoria);
    if (categoriaSelecionada) {
      setCategoriasAtivas((anteriores) =>
        anteriores.filter((anterior) => anterior != categoria)
      );
    } else {
      setCategoriasAtivas((anteriores) => [...anteriores, categoria]);
    }
  };

  const inserirCategoria = async () => {
    const dados = {
      nome: nomeCategoria,
      cor: corCategoria,
    };
    const retorno = await requisidor("category", "POST", dados);

    if (retorno.result == "Categoria adicionada com sucesso!") {
      const novaCategoria = {
        id_categoria: retorno.id_categoria,
        nome_categoria: nomeCategoria,
        cor: corCategoria,
      };
      setCategorias((categoriasAnteriores: Categoria[]) => [
        ...categoriasAnteriores,
        novaCategoria,
      ]);
      setCategoriasAtivas((prev) => [...prev, novaCategoria.id_categoria]);
      setNomeCategoria(() => "");
      setCorCategoria(() => "#86a5c3");
    } else {
      alert(retorno.result);
    }
  };

  const editarCategoria = async (categoria: Categoria) => {
    const retorno = await requisidor("category", "PUT", categoria);

    if (retorno.result == "Categoria editada com sucesso!") {
      setCategorias((categoriasAnteriores: Categoria[]) =>
        categoriasAnteriores.map((categoriaAnterior) =>
          categoriaAnterior.id_categoria == categoria.id_categoria
            ? categoria
            : categoriaAnterior
        )
      );
      setEdicaoCategoria(() => categoriaDefault);
    } else {
      alert(retorno.result);
    }
  };

  const excluirCategoria = async (id: number) => {
    const dados = {
      id_categoria: id,
    };
    const retorno = await requisidor("category", "DELETE", dados);

    if ((retorno.result = "Categoria apagada")) {
      setCategorias((categoriasAnteriores: Categoria[]) =>
        categoriasAnteriores.filter(
          (categoriaAnterior) => categoriaAnterior.id_categoria !== id
        )
      );
      setEdicaoCategoria(() => categoriaDefault);
      setTarefas((tarefasAnteriores) => {
        const teste = tarefasAnteriores.map((tarefa) =>
          tarefa.categoria == id ? { ...tarefa, categoria: null } : tarefa
        );
        console.log(teste);
        return teste;
      });
    }
  };

  const ativarTodasCategorias = () => {
    setCategoriasAtivas(() => [
      0,
      ...categorias.map((categoria) => categoria.id_categoria),
    ]);
  };

  const desativarTodasCategorias = () => {
    setCategoriasAtivas(() => []);
  };

  const campoCriarCategoria = () => {
    if (edicaoCategoria.id_categoria)
      setEdicaoCategoria(() => categoriaDefault);
    setNovaCategoria((prev) => !prev);
  };

  const controlarEdicaoCategoria = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    categoria: Categoria
  ) => {
    e.stopPropagation();
    if (novaCategoria) setNovaCategoria(() => false);
    setEdicaoCategoria((anterior) => {
      return anterior.id_categoria == categoria.id_categoria
        ? categoriaDefault
        : categoria;
    });
  };

  const style = {
    container: "flex justify-between items-center mb-2",
    tituloSecao: "text-lg mt-7 mb-3 font-medium",
    ferramentas: "flex mt-3",
    ferramentaCategoria:
      "p-1 rounded-sm bg-transparent border-none cursor-pointer flex items-center mr-1",
    edicaoCriacaoContainer: "mb-3",
    nomeCorContainer: "flex gap-2.5 items-center mb-2",
    inputNome:
      "grow outline-none p-2 rounded-md border-solid border border-gray-300",
    botaoContainer: "flex gap-2.5",
    botao: (cor: string) =>
      `border-none rounded-md w-full bg-[${cor}] p-3 cursor-pointer`,
    listaCategorias: "list-none",
    bordaCategoria:
      "p-0.5 pl-2 w-full box-border text-base cursor-pointer mb-3 rounded-md capitalize",
    categoria: "flex justify-between items-center p-2 rounded-md",
    tituloCategoria: "text-small font-medium",
  };

  return (
    <>
      <div
        className={style.container}
        onMouseEnter={() => setMostrarFerramentas(() => true)}
        onMouseLeave={() => setMostrarFerramentas(() => false)}
      >
        <h2 className={style.tituloSecao}>Categorias</h2>
        {mostrarFerramentas && (
          <div className={style.ferramentas}>
            <button
              className={style.ferramentaCategoria}
              onClick={ativarTodasCategorias}
            >
              <BiCheckboxChecked size={22} />
            </button>
            <button
              className={style.ferramentaCategoria}
              onClick={desativarTodasCategorias}
            >
              <BiCheckboxMinus size={22} />
            </button>
            <span
              onClick={campoCriarCategoria}
              className={style.ferramentaCategoria}
            >
              {novaCategoria ? (
                <BiMinusCircle size={19} />
              ) : (
                <BiPlusCircle size={19} />
              )}
            </span>
          </div>
        )}
      </div>
      {(novaCategoria || !!edicaoCategoria.id_categoria) && (
        <div className={style.edicaoCriacaoContainer}>
          <div className={style.nomeCorContainer}>
            <input
              type="text"
              placeholder="Nome da categoria"
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(() => e.target.value)}
              className={style.inputNome}
            />
            <input
              type="color"
              className="inputCor"
              value={corCategoria}
              onChange={(e) => setCorCategoria(() => e.target.value)}
            />
          </div>
          <div className={style.botaoContainer}>
            {novaCategoria && (
              <button
                type="submit"
                className={style.botao("#419E31")}
                style={{ backgroundColor: "#419E31" }}
                onClick={inserirCategoria}
              >
                Adicionar
              </button>
            )}
            {!!edicaoCategoria.id_categoria && (
              <>
                <button
                  type="submit"
                  className={style.botao("#419e31")}
                  style={{ backgroundColor: "#419E31" }}
                  onClick={() =>
                    editarCategoria({
                      id_categoria: edicaoCategoria.id_categoria,
                      nome_categoria: nomeCategoria,
                      cor: corCategoria,
                    })
                  }
                >
                  Editar
                </button>
                <button
                  type="submit"
                  className={style.botao("#e23936")}
                  onClick={() => excluirCategoria(edicaoCategoria.id_categoria)}
                >
                  Apagar
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <ul className={style.listaCategorias}>
        <li
          key={categoriaDefault.id_categoria}
          className={style.bordaCategoria}
          style={{ backgroundColor: categoriaDefault.cor }}
          onClick={() => selecaoCategoria(categoriaDefault.id_categoria)}
        >
          <div
            className={style.categoria}
            style={{
              backgroundColor: categoriasAtivas.includes(
                categoriaDefault.id_categoria
              )
                ? categoriaDefault.cor
                : "#e2e9f0",
            }}
          >
            <h4 className={style.tituloCategoria}>Sem categoria</h4>
          </div>
        </li>
        {categorias.map((categoria) => (
          <li
            key={categoria.id_categoria}
            className={style.bordaCategoria}
            style={{
              backgroundColor: categoria.cor,
            }}
            onClick={() => selecaoCategoria(categoria.id_categoria)}
          >
            <div
              className={style.categoria}
              style={{
                backgroundColor: categoriasAtivas.includes(
                  categoria.id_categoria
                )
                  ? categoria.cor
                  : "#e2e9f0",
              }}
            >
              <h4 className={style.tituloCategoria}>
                {categoria.nome_categoria}
              </h4>
              <span onClick={(e) => controlarEdicaoCategoria(e, categoria)}>
                {edicaoCategoria.id_categoria != categoria.id_categoria ? (
                  <AiFillEdit />
                ) : (
                  <GrFormClose size={24} />
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
