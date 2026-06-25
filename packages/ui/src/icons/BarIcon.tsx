const sizeStyles: { [key: string]: string } = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
};

interface BarIconProps {
    size?: "sm" | "md" | "lg";
}

export function BarIcon({ size = "md" }: BarIconProps) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={sizeStyles[size]}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>

    )
}