import { useState } from "react";

export const useRedimensionador = () => {
    const larguraTela = window.innerWidth;
    const [colFerramentas, setColFerramentas] = useState<number>(Number(localStorage.getItem("colEsq")) || larguraTela / 4);
    const [colEdicao, setColEdicao] = useState<number>(Number(localStorage.getItem("colDir")) || larguraTela / 4);
    const [redimensionandoFerramentas, setRedimensionandoFerramentas] =
      useState<boolean>(false);
    const [redimensionandoEdicao, setRedimensionandoEdicao] =
      useState<boolean>(false);
    
      const iniciarRedimensionamentoBarraFerramentas = () => setRedimensionandoFerramentas(() => true);
      const iniciarRedimensionamentoEditorTarefa = () => setRedimensionandoEdicao(() => true);
    
      const movimentarColunaEsquerda = (
        e: React.MouseEvent<HTMLElement, MouseEvent>
      ) => {
        if (redimensionandoFerramentas) {
          let novaLargura: number;
          if (e.clientX <= larguraTela / 5) novaLargura = larguraTela / 5;
          else if (e.clientX >= larguraTela / 3) novaLargura = larguraTela / 3;
          else novaLargura = e.clientX;
          localStorage.setItem("colEsq", String(novaLargura))
          setColFerramentas(() => novaLargura);
        }
    };
    
    const movimentarColunaDireita = (
        e: React.MouseEvent<HTMLElement, MouseEvent>
        ) => {
            if (redimensionandoEdicao) {
                const tamanho = larguraTela - e.clientX;
                let novaLargura: number;
                if (tamanho <= larguraTela / 5) novaLargura = larguraTela / 5;
                else if (tamanho >= larguraTela / 2.5) novaLargura = larguraTela / 2.5;
                else novaLargura = tamanho;
                localStorage.setItem("colDir", String(novaLargura))
          setColEdicao(() => novaLargura);
        }
      };
    
      const continuarRedimensionamento = (
        e: React.MouseEvent<HTMLElement, MouseEvent>
      ) => {
        movimentarColunaEsquerda(e);
        movimentarColunaDireita(e);
      };
    
      const encerrarRedimensionamento = () => {
        setRedimensionandoFerramentas(() => false);
        setRedimensionandoEdicao(() => false);
      };
    

      return {
        colFerramentas,
        colEdicao,
        iniciarRedimensionamentoBarraFerramentas,
        iniciarRedimensionamentoEditorTarefa,
        movimentarColunaEsquerda,
        movimentarColunaDireita,
        continuarRedimensionamento,
        encerrarRedimensionamento
      }
} 
