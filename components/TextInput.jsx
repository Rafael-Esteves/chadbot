export default function TextInput({ labelText, onChange, value }) {
  return (
    <div class="relative h-10 w-full min-w-[200px]">
      <input
        value={value}
        type="text"
        onChange={(e) => {
          onChange(e);
        }}
        className={`text-white peer h-full w-full rounded-[7px] border border-slate-200 bg-slate-900 px-3 py-2.5 font-sans text-sm font-normal text-white-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-white-200 ${
          value ? "outline-0 border-t-transparent " : ""
        }placeholder-shown:border-t-white-200 focus:border-2 focus:border-emerald-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-white-50`}
        placeholder=" "
      />
      <label className="text-white before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-white-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-white-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-white-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-white-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-emerald-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-emerald-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-emerald-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-white-500">
        {labelText}
      </label>
    </div>
  );
}
