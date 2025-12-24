import React from "react";
import { STYLES } from "@/constants/styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "font-extrabold rounded-xl px-4 py-2.5 transition-all duration-500";
  const variantClasses = {
    primary: `${STYLES.gradient} text-white ${STYLES.hoverScale} shadow-lg`,
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "bg-white border border-black/10 hover:bg-black/5",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "처리 중..." : children}
    </button>
  );
};

