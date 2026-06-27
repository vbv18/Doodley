const sizeStyles: { [key: string]: string } = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

interface IconProps {
  size?: "sm" | "md" | "lg";
}

export const LeftArrow = ({ size = "md" }: IconProps) => {
  return (
    <svg
      className={sizeStyles[size]}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};
