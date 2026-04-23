import React from "react";

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <p className="mt-1 text-xs font-semibold text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
      {message}
    </p>
  );
};
