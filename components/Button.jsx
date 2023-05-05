export default function Button({
  visible = true,
  color = "emerald",
  text = "Ok",
  action = () => {},
  disabled = false,
  iconFirst = false,
  children,
}) {
  return (
    <button
      className={`${disabled ? "opacity-50" : ""} ${
        visible ? "flex" : "hidden"
      } ${iconFirst ? "flex-row" : "flex-row-reverse"} items-center ${
        color == "slate"
          ? "bg-slate-500 hover:bg-slate-600"
          : color == "emerald"
          ? "bg-emerald-500 hover:bg-emerald-600"
          : "bg-violet-500 hover:bg-violet-600"
      }  text-white  font-bold uppercase text-sm  p-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 justify-center`}
      onClick={() => {
        action();
      }}
      disabled={disabled}
    >
      <div className={iconFirst ? "mr-2" : "ml-2"}>{children}</div>
      <div>{text}</div>
    </button>
  );
}
