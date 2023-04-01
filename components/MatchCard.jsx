import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";

export default function MatchCard() {
  const {
    loading,
    autoChatting,
    setAutoChatting,
    setLoading,
    matches,
    setMatches,
    excludedMatches,
    setExcludedMatches,
    style,
    setStyle,
    opener,
    setOpener,
    message,
    match,
  } = useContext(HomeContext);
  return match ? (
    <div className="flex flex-col text-center justify-items-center justify-center">
      <div class="grid justify-center">
        <img
          className="h-40 w-40 my-5 rounded-full overflow-hidden"
          src={match.person.photos[0].processedFiles[0].url}
          alt=""
        />
      </div>

      <div className="text-xl my-5 text-white">{match.person.name}</div>
      <textarea
        disabled
        className="text-xl mb-5 block p-2.5 w-full text-sm  rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 bg-slate-700 text-white"
        id="style"
        value={message}
        rows={10}
        cols={50}
      />
    </div>
  ) : (
    ""
  );
}
