const sizeStyles: { [key: string]: string } = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

interface IconProps {
  size?: "sm" | "md" | "lg";
}

export const Send = ({ size = "md" }: IconProps) => {
  return (
    <svg className={sizeStyles[size]} fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
    </svg>
  );
};
