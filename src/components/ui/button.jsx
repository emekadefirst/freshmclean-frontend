import React from "react";
import { Link } from "react-router-dom";
import MiniLoader from "./miniloader";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  isLoading = false,
  type = "button",
  href = "",
  to = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses =
    "font-medium text-sm rounded-lg px-4 py-2.5 transition duration-300 flex items-center justify-center cursor-pointer";

  // Variant-specific classes
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "border border-gray-300 hover:bg-gray-100 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
    link: "bg-transparent underline text-blue-600 hover:text-blue-800 p-0",
    dark: "text-white bg-black hover:bg-blue-800",
  };

  // Size-specific classes
  const sizeClasses = {
    small: "py-1 px-3",
    medium: "py-2 px-5",
    large: "py-3 px-6",
  };

  // Combine all the classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.medium}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  // If button is loading, show loader and prevent clicks
  const handleClick = (e) => {
    if (isLoading || disabled) {
      e.preventDefault();
      return;
    }
    onClick && onClick(e);
  };

  // Content to display inside button
  const content = isLoading ? <MiniLoader /> : children;

  // If href is provided, render as an anchor
  if (href) {
    return (
      <a href={href} className={buttonClasses} onClick={handleClick} {...props}>
        {content}
      </a>
    );
  }

  // If to is provided, render as a React Router Link
  if (to) {
    return (
      <Link to={to} className={buttonClasses} onClick={handleClick} {...props}>
        {content}
      </Link>
    );
  }

  // Otherwise, render as a button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;