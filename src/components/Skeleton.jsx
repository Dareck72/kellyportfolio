import React from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={"bg-gray-700 animate-pulse rounded " + className}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
