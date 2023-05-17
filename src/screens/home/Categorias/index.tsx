import { useState } from "react";
import ICategoria from "../../../interfaces/categoria";
import { CategoriasProps } from "../../../interfaces/props";
import { categoriaDefault } from "../../../utils/modelos";
import "./style.css";
import Categoria from "./Categoria";
import { BsCheck } from "react-icons/bs";
import { GrFormClose } from "react-icons/gr";
import {
  BiPlusCircle,
  BiMinusCircle,
  BiCheckboxMinus,
  BiCheckboxChecked,
} from "react-icons/bi";
import api from "../../../service/api";

export default function Categorias({
  tarefas,
  categorias,
  categoriasAtivas,
  setCategoriasAtivas,
  setCategorias,
  setTarefas,
  setExibindoModal,
}: CategoriasProps) {
  const [novaCategoria, setNovaCategoria] = useState(false);
  const [edicaoCategoria, setEdicaoCategoria] =
    useState<ICategoria>(categoriaDefault);
  const [nomeNovaCategoria, setNomeNovaCategoria] = useState("");
  const [corNovaCategoria, setCorNovaCategoria] = useState("#e2e9f0");
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

    try {
      const tokenJWT = localStorage.getItem("auth") || "";
      const { data } = await api.post("/category", dados, {
        headers: { "x-access-token": tokenJWT },
      });

      const novaCategoria = {
        id_categoria: data.id_categoria,
        nome_categoria: nomeNovaCategoria,
        cor: corNovaCategoria,
      };
      setCategorias((categoriasAnteriores: ICategoria[]) => [
        ...categoriasAnteriores,
        novaCategoria,
      ]);
      setCategoriasAtivas((prev) => [...prev, novaCategoria.id_categoria]);
      setNomeNovaCategoria(() => "");
      setCorNovaCategoria(() => "#e2e9f0");
      exibirCampoCriarCategoria();
    } catch (error: any) {
      const result = error.response.data.result;
      alert(result);
    }
  };

  const editarCategoria = async (categoria: ICategoria) => {
    try {
      const tokenJWT = localStorage.getItem("auth") || "";
      await api.put("category", categoria, {
        headers: { "x-access-token": tokenJWT },
      });
      setCategorias((categoriasAnteriores: ICategoria[]) =>
        categoriasAnteriores.map((categoriaAnterior) =>
          categoriaAnterior.id_categoria == categoria.id_categoria
            ? categoria
            : categoriaAnterior
        )
      );
      setEdicaoCategoria(() => categoriaDefault);
    } catch (error: any) {
      const result = error.response.data.result;
      alert(result);
    }
  };

  const excluirCategoria = async (id: number) => {
    try {
      const tokenJWT = localStorage.getItem("auth") || "";
      await api.delete(`/category/${id}`, {
        headers: { "x-access-token": tokenJWT },
      });
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
        return teste;
      });
    } catch (error: any) {
      const result = error.response.data.result;
      console.log(error);
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
              title="Selecionar todos"
              aria-label="Selecionar todos"
              className={style.ferramentaCategoria}
              onClick={ativarTodasCategorias}
            >
              <BiCheckboxChecked size={22} />
            </button>
            <button
              title="Desmarcar todos"
              aria-label="Desmarcar todos"
              className={style.ferramentaCategoria}
              onClick={desativarTodasCategorias}
            >
              <BiCheckboxMinus size={22} />
            </button>
            <button
              title="Adicionar categoria"
              aria-label="Adicionar categoria"
              onClick={exibirCampoCriarCategoria}
              className={style.ferramentaCategoria}
            >
              {novaCategoria ? (
                <BiMinusCircle size={19} />
              ) : (
                <BiPlusCircle size={19} />
              )}
            </button>
          </div>
        )}
      </div>
      {novaCategoria && (
        <div className="p-0.5 pl-2 w-full box-border text-base cursor-pointer mb-3 rounded-md capitalize border border-solid border-black">
          <div className="flex justify-between items-center p-3 rounded-md">
            <input
              className="inputCor border border-solid border-black rounded-md"
              type="color"
              value={corNovaCategoria}
              onChange={handleCorCategoriaValue}
            />
            <input
              className="outline-none rounded-md p-1 mx-3 w-4/6 bg-transparent"
              placeholder="Nova categoria"
              type="text"
              value={nomeNovaCategoria}
              onChange={handleNomeCategoriaValue}
            />
            <span>
              <div className="flex gap-2 items-center">
                <span
                  title="Confirmar edição"
                  aria-label="Confirmar edição"
                  onClick={inserirCategoria}
                >
                  <BsCheck size={20} />
                </span>
                <span
                  title="Cancelar edição"
                  aria-label="Cancelar edição"
                  onClick={exibirCampoCriarCategoria}
                >
                  <GrFormClose size={20} />
                </span>
              </div>
            </span>
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
