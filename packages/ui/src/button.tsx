import { forwardRef, ReactNode } from "react";


const VariantStyle = {
	primary: "bg-primary-btn-bg text-primary-btn-txt hover:bg-primary-btn-hover-bg",
	secondary: "bg-secondary-btn-bg text-secondary-btn-txt hover:bg-secondary-btn-hover-bg",
	tertiary: "bg-tertiary-btn-bg text-tertiary-btn-txt hover:bg-tertiary-btn-hover-bg",
};

const SizeStyle = {
	sm: "px-3 py-1 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-6 py-3 text-lg",
	xl: "px-6 py-3 w-full"
}

type VariantType = keyof typeof VariantStyle
type SizeType = keyof typeof SizeStyle;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: VariantType;
	size?: SizeType;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
	{
		type = "button",
		variant = "primary",
		size = "md",
		children,
		className = "",
		startIcon,
		endIcon,
		disabled = false,
		...props
	}, ref) => {

	return (

		<button
			ref={ref}
			type={type}
			disabled={disabled}
			className={`
				flex items-center justify-center gap-2 
				rounded-md font-medium 
                ${className}
                ${VariantStyle[variant]}
                ${SizeStyle[size]}
                ${disabled
					? 'opacity-50 cursor-not-allowed'
					: variant !== "tertiary"
						? 'transition-all duration-300 ease-out cursor-pointer hover:brightness-95 hover:shadow-lg'
						: 'cursor-pointer'
				}
			`}
			{...props}
		>

			{startIcon && (
				<span>
					{startIcon}
				</span>
			)}

			{children}

			{endIcon && (
				<span>
					{endIcon}
				</span>
			)}
		</button>
	);
});

Button.displayName = "Button";