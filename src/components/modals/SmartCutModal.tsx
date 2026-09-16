import React from 'react';

export const SmartCutModal = ({ isOpen, onClose, ...props }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#121218] rounded-xl p-4 w-96 text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4">X</button>
        <h2>Smart Cut Modal</h2>
      </div>
    </div>
  );
};
