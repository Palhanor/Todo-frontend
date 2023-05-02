import { IModal } from "../../interfaces/modal";
import { modalDefault } from "../../utils/modelos";

export default function Modal({
  exibindoModal,
  setExibindoModal,
}: {
  exibindoModal: IModal;
  setExibindoModal: React.Dispatch<React.SetStateAction<IModal>>;
}) {
  return (
    <div className="w-2/5 shadow-md py-14 px-14 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-xl bg-white/50 backdrop-blur border border-solid border-white/18">
      <h2 className="text-center text-2xl font-bold mb-5">
        {exibindoModal.titulo}
      </h2>
      <p className="text-gray-700 text-center text-lg mb-8">
        {exibindoModal.descricao}
      </p>
      <div className="flex justify-end items-center gap-5">
        <button
          className="bg-[#6A9BCD] p-3 rounded-md hover:bg-[#5684B4]"
          onClick={() => {
            exibindoModal.confirmacao();
            setExibindoModal(() => modalDefault);
          }}
        >
          Confirmar
        </button>
        <button
          className="bg-[#DE3373] p-3 rounded-md hover:bg-[#CD2966]"
          onClick={() =>
            setExibindoModal(() => {
              return { ...exibindoModal, visivel: false };
            })
          }
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
