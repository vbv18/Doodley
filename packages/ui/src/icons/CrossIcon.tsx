const sizeStyles: { [key: string]: string } = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
};

interface CrossIconProps {
    size?: "sm" | "md" | "lg";
}

export function CrossIcon({ size = "md" }: CrossIconProps) {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={sizeStyles[size]}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    )
}