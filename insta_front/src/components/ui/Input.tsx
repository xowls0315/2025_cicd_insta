import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      className="
        mt-4 w-full
        border-0 border-b border-black/15
        px-1 py-3
        outline-none
        placeholder:text-black/35
        focus:border-fuchsia-500
      "
    />
  );
};

