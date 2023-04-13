import Button from "./Button";

export default function Modal({
  visible,
  setVisible = () => {},
  title,
  children,
  positive = () => {},
  positiveText = "Ok",
  negative = () => {},
  negativeText = "Cancel",
}) {
  return (
    visible && (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-5">
          <div className="relative w-auto my-6 mx-auto max-w-3xl ">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg rela5ive flex flex-col w-full bg-slate-800 outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid text-white border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold">{title}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setVisible(false)}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative flex-auto">{children}</div>
              {/*footer*/}
              <div className="flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
                <Button
                  color="slate"
                  text={negativeText}
                  action={() => {
                    negative();
                    setVisible(false);
                  }}
                />
                <Button
                  text={positiveText}
                  action={() => {
                    positive();
                    setVisible(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    )
  );
}
