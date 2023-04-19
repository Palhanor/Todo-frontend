export const pegarDataAtual = () => {
    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate());
    const dataFinal = dataAtual.toLocaleString().substring(0, 10);
    const [dia, mes, ano] = dataFinal.split("/")
    return `${ano}-${mes}-${dia}`;
};

export const pegarDataEspecifica = (data: string) => {
    const dataEspecifica = new Date(data);
    dataEspecifica.setDate(dataEspecifica.getDate());
    const dataFinal = dataEspecifica.toISOString().substring(0, 10);
    return dataFinal;
};

export const formatarData = (data: string) => {
    const [ano, mes, dia] = data.substring(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
};

export const formatarDataPrincipal = (data: string) => {
    const [nome_mes, dia_semana] = new Date(data)
        .toLocaleDateString("pt-br", {
            weekday: "long",
            month: "long",
            timeZone: "UTC",
        })
        .split(" ");
    const num_dia = data.substring(0, 10).split("-")[2];
    return `${dia_semana[0].toUpperCase() + dia_semana.substring(1)}, 
        ${num_dia} de ${nome_mes[0].toUpperCase() + nome_mes.substring(1)}`;
};
