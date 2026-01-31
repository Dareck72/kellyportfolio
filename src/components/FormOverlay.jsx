import React from "react";

const FormOverlay = ({ loading = false }) => {
  if (!loading) return null;
  return (
    <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <div className="text-white">Chargement...</div>
      </div>
    </div>
  );
};

export default FormOverlay;
