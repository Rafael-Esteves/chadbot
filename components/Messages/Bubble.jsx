import { useContext } from "react";
import { HomeContext } from "@/context/HomeContext";

export default function Bubble({ msg }) {
  const { match } = useContext(HomeContext);

  return msg.from == match.person._id ? (
    <div className="my-2 p-3 bg-slate-500 rounded-lg text-start w-fit">
      {msg.message}
    </div>
  ) : (
    <div className="flex flex-row  my-2  justify-end">
      <div className=" w-fit bg-emerald-600 rounded-lg p-3"> {msg.message}</div>
    </div>
  );
}
