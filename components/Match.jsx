import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import useTranslation from "next-translate/useTranslation";

export default function Match({ selected, setShowSelectedMatches, match }) {
  const { selectedMatches, setSelectedMatches, setMatch } =
    useContext(HomeContext);
  const { t } = useTranslation("main");

  return (
    <div className="flex flex-row h-24 border-b border-slate-400">
      <div
        className={`flex flex-row py-2 align-middle cursor-pointer ${
          selected
            ? "bg-emerald-100 hover:bg-emerald-400"
            : "bg-slate-100 hover:bg-slate-400"
        } text-black w-full`}
        onClick={() => {
          if (selected)
            setSelectedMatches(
              selectedMatches.filter((m) => m._id != match._id)
            );
          else setSelectedMatches(selectedMatches.concat(match));
        }}
        key={match._id}
      >
        <div className="h-20 w-20 rounded-full overflow-hidden  mr-4">
          <img
            src={match.person.photos[0].processedFiles[0].url}
            alt=""
            className="object-cover"
          />
        </div>
        <div className="flex items-center text-emerald-600">
          <div>{match.person.name}</div>
        </div>
      </div>
      {/* <button
        onClick={() => {
          setMatch(match);
          setShowSelectedMatches(false);
        }}
        className="h-full align-middle items-center flex self-center ml-auto  uppercase text-sm bg-slate-500 hover:bg-slate-600 p-2"
      >
        {t("generate_message")}
      </button> */}
    </div>
  );
}
