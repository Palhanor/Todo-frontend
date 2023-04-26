import { useEffect, useState } from "react";

import Categoria from "../../../interfaces/categoria";
import { CategoriasProps } from "../../../interfaces/props";

import { categoriaDefault } from "../../../utils/modelos";

import {
  BiPlusCircle,
  BiMinusCircle,
  BiCheckboxMinus,
  BiCheckboxChecked,
} from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";

import "./style.css";

export default function Categorias({
  categorias,
  categoriasAtivas,
  setCategoriasAtivas,
  requisidor,
  setCategorias,
}: CategoriasProps) {
  const [novaCategoria, setNovaCategoria] = useState(false);
  const [edicaoCategoria, setEdicaoCategoria] =
    useState<Categoria>(categoriaDefault);

  const [nomeCategoria, setNomeCategoria] = useState("");
  const [corCategoria, setCorCategoria] = useState("#86a5c3");

  useEffect(() => {
    if (edicaoCategoria) {
      setNomeCategoria(() => edicaoCategoria.nome_categoria);
      setCorCategoria(() => `#${edicaoCategoria.cor}`);
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
      cor: corCategoria.replace("#", ""),
    };
    const retorno = await requisidor("category", "POST", dados);

    if (retorno.result == "Categoria adicionada com sucesso!") {
      const novaCategoria = {
        id_categoria: retorno.id_categoria,
        nome_categoria: nomeCategoria,
        cor: corCategoria.replace("#", ""),
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
      // Remover de categoriasAtivas?
      setEdicaoCategoria(() => categoriaDefault);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md mt-4 mb-3 font-normal">Categorias</h2>
        <div className="flex">
          <button
            className="p-1 rounded-sm bg-transparent border-none cursor-pointer flex items-center mr-1"
            onClick={() => {
              setCategoriasAtivas(() => [
                0,
                ...categorias.map((categoria) => categoria.id_categoria),
              ]);
            }}
          >
            <BiCheckboxChecked size={24} />
          </button>
          <button
            className="p-1 rounded-sm bg-transparent border-none cursor-pointer flex items-center mr-1"
            onClick={() => {
              setCategoriasAtivas(() => []);
            }}
          >
            <BiCheckboxMinus size={24} />
          </button>
          <span
            onClick={() => {
              if (edicaoCategoria.id_categoria)
                setEdicaoCategoria(() => categoriaDefault);
              setNovaCategoria((prev) => !prev);
            }}
            className="p-1 rounded-sm bg-transparent border-none cursor-pointer flex items-center"
          >
            {novaCategoria ? (
              <BiMinusCircle size={19} />
            ) : (
              <BiPlusCircle size={19} />
            )}
          </span>
        </div>
      </div>
      {(novaCategoria || !!edicaoCategoria.id_categoria) && (
        <div className="mb-3">
          <div className="flex gap-2.5 items-center mb-2">
            <input
              type="text"
              placeholder="Nome da categoria"
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(() => e.target.value)}
              className="grow outline-none p-2 rounded-md border-solid border border-gray-300"
            />
            <input
              type="color"
              className="inputCor"
              value={corCategoria}
              onChange={(e) => setCorCategoria(() => e.target.value)}
            />
          </div>
          <div className="flex gap-2.5">
            {novaCategoria && (
              <button
                type="submit"
                className="border-none rounded-md w-full bg-[#419e31] p-3 cursor-pointer"
                onClick={inserirCategoria}
              >
                Adicionar
              </button>
            )}
            {!!edicaoCategoria.id_categoria && (
              <>
                <button
                  type="submit"
                  className="border-none rounded-md w-full bg-[#419e31] p-3 cursor-pointer"
                  onClick={() =>
                    editarCategoria({
                      id_categoria: edicaoCategoria.id_categoria,
                      nome_categoria: nomeCategoria,
                      cor: corCategoria.replace("#", ""),
                    })
                  }
                >
                  Editar
                </button>
                <button
                  type="submit"
                  className="border-none rounded-md w-full bg-[#e23936] p-3 cursor-pointer"
                  onClick={() => excluirCategoria(edicaoCategoria.id_categoria)}
                >
                  Apagar
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <ul className="list-none">
        <li
          key={categoriaDefault.id_categoria}
          className="p-0.5 pl-2 w-full box-border text-base cursor-pointer mb-3 rounded-md capitalize"
          style={{
            backgroundColor: `#${categoriaDefault.cor}`,
          }}
          onClick={() => selecaoCategoria(categoriaDefault.id_categoria)}
        >
          <div
            className="flex justify-between items-center p-2 rounded-md"
            style={{
              backgroundColor: categoriasAtivas.includes(
                categoriaDefault.id_categoria
              )
                ? `#${categoriaDefault.cor}`
                : "#e2e9f0",
            }}
          >
            <h4 className="text-small font-medium">Sem categoria</h4>
          </div>
        </li>
        {categorias.map((categoria) => (
          <li
            key={categoria.id_categoria}
            className="p-0.5 pl-2 w-full box-border text-base cursor-pointer mb-3 rounded-md capitalize"
            style={{
              backgroundColor: `#${categoria.cor}`,
            }}
            onClick={() => selecaoCategoria(categoria.id_categoria)}
          >
            <div
              className="flex justify-between items-center p-2 rounded-md"
              style={{
                backgroundColor: categoriasAtivas.includes(
                  categoria.id_categoria
                )
                  ? `#${categoria.cor}`
                  : "#e2e9f0",
              }}
            >
              <h4 className="text-small font-medium">
                {categoria.nome_categoria}
              </h4>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (novaCategoria) setNovaCategoria(() => false);
                  setEdicaoCategoria((anterior) => {
                    return anterior.id_categoria == categoria.id_categoria
                      ? categoriaDefault
                      : categoria;
                  });
                }}
              >
                <AiFillEdit />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
