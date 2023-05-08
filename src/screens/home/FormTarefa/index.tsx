import { useEffect, useState } from "react";
import { pegarDataAtual } from "../../../utils/datas";
import Tarefa from "../../../interfaces/tarefa";
import { FormTarefaProps } from "../../../interfaces/props";

export default function FormTarefa({
  user,
  categorias,
  tarefaSelecionada,
  requisidor,
  setTarefas,
  setTarefaSelecionada,
}: FormTarefaProps) {
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [dataFinal, setDataFinal] = useState<string>("");
  const [selectCategoria, setSelectCategoria] = useState<number>(
    tarefaSelecionada.categoria || 0
  );

  useEffect(() => {
    setDataFinal(() => pegarDataAtual());
  }, []);

  const inserirTarefa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const categoria = selectCategoria ? selectCategoria : null;
    const dados = {
      usuario: user.id_usuario,
      titulo: titulo,
      descricao: descricao,
      dataFinal: dataFinal,
      categoria: categoria,
    };
    const retorno = await requisidor("tasks", "POST", dados);

    if (retorno.result == "Atividade adicionada com sucesso!") {
      const novaTarefa = {
        id_tarefa: retorno.id_tarefa,
        titulo,
        descricao,
        data_final: dataFinal,
        categoria: Number(selectCategoria),
        realizada: 0,
      };
      setTarefas((tarefasAntigas: Tarefa[]) => [...tarefasAntigas, novaTarefa]);
      setTarefaSelecionada(() => novaTarefa);
      setTitulo(() => "");
    } else {
      alert(retorno.result);
    }
  };

  const handleTituloValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(() => e.target.value);
  };

  const handleDataValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataFinal(() => e.target.value);
  };

  const style = {
    form: "flex w-full gap-2.5",
    inputTarefa:
      "grow min-w-5 p-4 border-none rounded-md bg-[#e2e9f0] outline-none",
    inputData: "p-4 border-none rounded-md bg-[#e2e9f0] outline-none",
    botao:
      "py-3 px-4 border-none rounded-md bg-[#86a5c3] outline-none cursor-pointer",
  };

  return (
    <form
      onSubmit={inserirTarefa}
      className={style.form}
      style={{ flexDirection: tarefaSelecionada.id_tarefa ? "column" : "row" }}
    >
      <input
        required
        type="text"
        placeholder="Insira uma nova tarefa"
        value={titulo}
        onChange={handleTituloValue}
        className={style.inputTarefa}
      />
      <div className="flex gap-2">
        <div
          style={{ width: tarefaSelecionada.id_tarefa ? "100%" : "auto" }}
          className="bg-[#e2e9f0] flex items-center rounded-md"
        >
          <input
            required
            type="date"
            value={dataFinal}
            onChange={handleDataValue}
            className="grow p-3 bg-transparent border border-solid border-r-gray-300 rounded-l-md outline-none cursor-pointer text-base text-gray-700"
          />
          <select
            value={selectCategoria}
            className="grow p-3 border-none bg-transparent outline-none cursor-pointer text-gray-700 text-base coursor-pointer"
            onChange={(e) => setSelectCategoria(() => Number(e.target.value))}
          >
            <option value={0}>Sem categoria</option>
            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={categoria.id_categoria}
              >
                {categoria.nome_categoria}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={style.botao}>
          Adicionar
        </button>
      </div>
    </form>
  );
}
