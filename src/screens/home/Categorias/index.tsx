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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: ".4rem",
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            margin: "1rem 0 .6rem",
            fontWeight: "500",
          }}
        >
          Categorias
        </h2>
        <div style={{ display: "flex" }}>
          <button
            style={{
              padding: ".2rem",
              borderRadius: "5px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              marginRight: ".3rem",
            }}
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
            style={{
              padding: ".2rem",
              borderRadius: "5px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              marginRight: ".3rem",
            }}
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
            style={{
              padding: ".2rem",
              borderRadius: "5px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
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
        <div style={{ marginBottom: ".8rem" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: ".4rem",
            }}
          >
            <input
              type="text"
              placeholder="Nome da categoria"
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(() => e.target.value)}
              style={{
                flexGrow: "1",
                outline: "none",
                padding: ".4rem",
                borderRadius: "5px",
                border: "1px solid gray",
              }}
            />
            <input
              type="color"
              className="inputCor"
              value={corCategoria}
              onChange={(e) => setCorCategoria(() => e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {novaCategoria && (
              <button
                type="submit"
                style={{
                  border: "none",
                  borderRadius: "5px",
                  width: "100%",
                  backgroundColor: "#419e31",
                  padding: ".5rem",
                  cursor: "pointer",
                }}
                onClick={inserirCategoria}
              >
                Nova categoria
              </button>
            )}
            {!!edicaoCategoria.id_categoria && (
              <>
                <button
                  type="submit"
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    width: "100%",
                    backgroundColor: "#419e31",
                    padding: ".5rem",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    editarCategoria({
                      id_categoria: edicaoCategoria.id_categoria,
                      nome_categoria: nomeCategoria,
                      cor: corCategoria.replace("#", ""),
                    })
                  }
                >
                  Editar categoria
                </button>
                <button
                  type="submit"
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    width: "100%",
                    backgroundColor: "#e23936",
                    padding: ".5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => excluirCategoria(edicaoCategoria.id_categoria)}
                >
                  Apagar categoria
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <ul
        style={{
          listStyle: "none",
          // overflow: "auto",
          // scrollbarWidth: "thin",
          // paddingRight: "5px",
          // height: "42vh",
        }}
      >
        <li
          key={categoriaDefault.id_categoria}
          style={{
            padding: "2px 2px 2px 10px",
            width: "100%",
            boxSizing: "border-box",
            fontSize: ".9rem",
            cursor: "pointer",
            marginBottom: ".6rem",
            borderRadius: "5px",
            textTransform: "capitalize",
            backgroundColor: `#${categoriaDefault.cor}`,
          }}
          onClick={() => selecaoCategoria(categoriaDefault.id_categoria)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: ".5rem",
              borderRadius: "3px",
              backgroundColor: categoriasAtivas.includes(
                categoriaDefault.id_categoria
              )
                ? `#${categoriaDefault.cor}`
                : "#e2e9f0",
            }}
          >
            <h4 style={{ fontSize: ".9rem", fontWeight: "500" }}>
              Sem categoria
            </h4>
          </div>
        </li>
        {categorias.map((categoria) => (
          <li
            key={categoria.id_categoria}
            style={{
              padding: "2px 2px 2px 10px",
              width: "100%",
              boxSizing: "border-box",
              fontSize: ".9rem",
              cursor: "pointer",
              marginBottom: ".6rem",
              borderRadius: "5px",
              textTransform: "capitalize",
              backgroundColor: `#${categoria.cor}`,
            }}
            onClick={() => selecaoCategoria(categoria.id_categoria)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: ".5rem",
                borderRadius: "3px",
                backgroundColor: categoriasAtivas.includes(
                  categoria.id_categoria
                )
                  ? `#${categoria.cor}`
                  : "#e2e9f0",
              }}
            >
              <h4 style={{ fontSize: ".9rem", fontWeight: "500" }}>
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
