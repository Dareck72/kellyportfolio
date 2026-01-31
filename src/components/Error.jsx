import React from "react";

const Error = ({ message }) => {
  return (
    <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
      <p>{message || "An error occurred"}</p>
    </div>
  );
};

export default Error;
