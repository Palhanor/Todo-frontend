import { useState } from "react";
import ICategoria from "../../../interfaces/categoria";
import { CategoriasProps } from "../../../interfaces/props";
import { categoriaDefault } from "../../../utils/modelos";
import {
  BiPlusCircle,
  BiMinusCircle,
  BiCheckboxMinus,
  BiCheckboxChecked,
} from "react-icons/bi";
import "./style.css";
import Categoria from "./Categoria";

export default function Categorias({
  tarefas,
  categorias,
  categoriasAtivas,
  setCategoriasAtivas,
  requisidor,
  setCategorias,
  setTarefas,
  setExibindoModal,
}: CategoriasProps) {
  const [novaCategoria, setNovaCategoria] = useState(false);
  const [edicaoCategoria, setEdicaoCategoria] =
    useState<ICategoria>(categoriaDefault);
  const [nomeNovaCategoria, setNomeNovaCategoria] = useState("");
  const [corNovaCategoria, setCorNovaCategoria] = useState("#86a5c3");
  const [mostrarFerramentas, setMostrarFerramentas] = useState<boolean>(false);

  const selecionarCategoria = (categoria: number) => {
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
      nome: nomeNovaCategoria,
      cor: corNovaCategoria,
    };
    const retorno = await requisidor("category", "POST", dados);

    if (retorno.result == "Categoria adicionada com sucesso!") {
      const novaCategoria = {
        id_categoria: retorno.id_categoria,
        nome_categoria: nomeNovaCategoria,
        cor: corNovaCategoria,
      };
      setCategorias((categoriasAnteriores: ICategoria[]) => [
        ...categoriasAnteriores,
        novaCategoria,
      ]);
      setCategoriasAtivas((prev) => [...prev, novaCategoria.id_categoria]);
      setNomeNovaCategoria(() => "");
      setCorNovaCategoria(() => "#86a5c3");
    } else {
      alert(retorno.result);
    }
  };

  const editarCategoria = async (categoria: ICategoria) => {
    const retorno = await requisidor("category", "PUT", categoria);

    if (retorno.result == "Categoria editada com sucesso!") {
      setCategorias((categoriasAnteriores: ICategoria[]) =>
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
      setCategorias((categoriasAnteriores: ICategoria[]) =>
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

  const exibirCampoCriarCategoria = () => {
    setNovaCategoria((prev) => !prev);
  };

  const controlarEdicaoCategoria = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    categoria: ICategoria
  ) => {
    e.stopPropagation();
    if (novaCategoria) setNovaCategoria(() => false);
    setEdicaoCategoria((anterior) => {
      return anterior.id_categoria == categoria.id_categoria
        ? categoriaDefault
        : categoria;
    });
  };

  const exibirFerramentasCategoria = () => {
    setMostrarFerramentas(() => true);
  };

  const ocultarFerramentasCategoria = () => {
    setMostrarFerramentas(() => false);
  };

  const handleNomeCategoriaValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeNovaCategoria(() => e.target.value);
  };

  const handleCorCategoriaValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorNovaCategoria(() => e.target.value);
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
  };

  return (
    <>
      <div
        className={style.container}
        onMouseEnter={exibirFerramentasCategoria}
        onMouseLeave={ocultarFerramentasCategoria}
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
              onClick={exibirCampoCriarCategoria}
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
      {novaCategoria && (
        <div className={style.edicaoCriacaoContainer}>
          <div className={style.nomeCorContainer}>
            <input
              type="text"
              placeholder="Nome da categoria"
              value={nomeNovaCategoria}
              onChange={handleNomeCategoriaValue}
              className={style.inputNome}
            />
            <input
              type="color"
              className="inputCor"
              value={corNovaCategoria}
              onChange={handleCorCategoriaValue}
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
          </div>
        </div>
      )}
      <ul className={style.listaCategorias}>
        <Categoria
          key={categoriaDefault.id_categoria}
          tarefas={tarefas}
          categoria={categoriaDefault}
          categoriasAtivas={categoriasAtivas}
          edicaoCategoria={edicaoCategoria}
          selecionarCategoria={selecionarCategoria}
          controlarEdicaoCategoria={controlarEdicaoCategoria}
          excluirCategoria={excluirCategoria}
          editarCategoria={editarCategoria}
          setExibindoModal={setExibindoModal}
        />
        {categorias.map((categoria) => (
          <Categoria
            key={categoria.id_categoria}
            tarefas={tarefas}
            categoria={categoria}
            categoriasAtivas={categoriasAtivas}
            edicaoCategoria={edicaoCategoria}
            selecionarCategoria={selecionarCategoria}
            controlarEdicaoCategoria={controlarEdicaoCategoria}
            excluirCategoria={excluirCategoria}
            editarCategoria={editarCategoria}
            setExibindoModal={setExibindoModal}
          />
        ))}
      </ul>
    </>
  );
}
