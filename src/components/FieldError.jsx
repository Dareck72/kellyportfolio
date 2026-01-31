import React from "react";

const FieldError = ({ children }) => {
  return <p className="text-red-400 text-sm mt-1">{children}</p>;
};

export default FieldError;
