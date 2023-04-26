import { useEffect, useState } from "react";
import { pegarDataAtual } from "../../../utils/datas";
import Tarefa from "../../../interfaces/tarefa";
import { FormTarefaProps } from "../../../interfaces/props";

export default function FormTarefa({
  user,
  requisidor,
  setTarefas,
  setTarefaSelecionada,
}: FormTarefaProps) {
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [dataFinal, setDataFinal] = useState<string>("");

  useEffect(() => {
    setDataFinal(() => pegarDataAtual());
  }, []);

  const inserirTarefa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dados = {
      usuario: user.id_usuario,
      titulo: titulo,
      descricao: descricao,
      dataFinal: dataFinal,
    };
    const retorno = await requisidor("tasks", "POST", dados);

    if (retorno.result == "Atividade adicionada com sucesso!") {
      const novaTarefa = {
        id_tarefa: retorno.id_tarefa,
        titulo,
        descricao,
        data_final: dataFinal,
        categoria: null,
        realizada: 0,
      };
      setTarefas((tarefasAntigas: Tarefa[]) => [...tarefasAntigas, novaTarefa]);
      setTarefaSelecionada(() => novaTarefa);
      setTitulo(() => "");
    } else {
      alert(retorno.result);
    }
  };

  return (
    <form onSubmit={inserirTarefa} className="flex w-full gap-2.5">
      <input
        required
        type="text"
        placeholder="Insira uma nova tarefa"
        value={titulo}
        onChange={(e) => setTitulo(() => e.target.value)}
        className="grow p-4 border-none rounded-md bg-[#e2e9f0] outline-none"
      />
      <input
        required
        type="date"
        value={dataFinal}
        onChange={(e) => setDataFinal(() => e.target.value)}
        className="p-4 border-none rounded-md bg-[#e2e9f0] outline-none"
      />
      <button
        type="submit"
        className="p-4 border-none rounded-md bg-[#86a5c3] outline-none cursor-pointer"
      >
        Adicionar
      </button>
    </form>
  );
}
