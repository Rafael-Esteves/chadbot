import React from "react";

const Alert = ({ type, message }) => {
  const alertClasses = {
    success: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  return (
    message && (
      <div
        className={`fixed bottom-5 right-5 z-10 border-l-4 p-4 ${alertClasses[type]}`}
      >
        <p className="font-bold">{type.toUpperCase()}</p>
        <p>{message}</p>
      </div>
    )
  );
};

export default Alert;
