export default function Match({
  selected,
  match,
  excludedMatches,
  setExcludedMatches,
}) {
  return selected ? (
    <div
      className="flex flex-row py-2 border-b border-slate-400 align-middle cursor-pointer hover:bg-emerald-400 bg-emerald-100 text-black"
      onClick={() => {
        setExcludedMatches(excludedMatches.concat(match._id));
      }}
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
  ) : (
    <div
      onClick={() => {
        setExcludedMatches(excludedMatches.filter((m) => m != match._id));
      }}
      key={match._id}
      className="flex flex-row py-2 border-b border-slate-400 align-middle cursor-pointer hover:bg-slate-400 bg-slate-100 text-black"
    >
      <div className="h-20 w-20 rounded-full overflow-hidden  mr-4">
        <img
          src={match.person.photos[0].processedFiles[0].url}
          alt=""
          className="object-cover"
        />
      </div>
      <div className="flex items-center text-slate-600">
        <div>{match.person.name}</div>
      </div>
    </div>
  );
}
