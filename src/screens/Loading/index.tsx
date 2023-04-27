import { TbLoader } from "react-icons/tb";
import "./style.css";

export default function Loading() {
  const style = {
    loading:
      "rotacionar w-[90px] ml-[46vw] mt-[46vh] -translate-y-full -translate-x-full",
  };

  return (
    <div className={style.loading}>
      <TbLoader size={90} color="#86a5c3" />
    </div>
  );
}
