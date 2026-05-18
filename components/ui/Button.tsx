import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "outline" | "light";

type BaseProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonLinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonNativeProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonProps = ButtonLinkProps | ButtonNativeProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_10px_24px_rgba(232,0,29,0.28)] hover:bg-[var(--color-accent-hover)]",
  outline:
    "border-white/35 bg-black/35 text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  light:
    "border-white bg-white text-[var(--color-text-dark)] hover:bg-zinc-100",
};

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const classes = [
    "inline-flex h-11 items-center justify-center gap-2 rounded-[4px] border px-5 text-sm font-bold uppercase tracking-wide transition-all duration-300 hover:brightness-110 active:scale-95",
    variantClasses[variant],
    className,
  ].join(" ");

  if (props.href !== undefined) {
    const {
      children: omittedChildren,
      variant: omittedVariant,
      className: omittedClassName,
      ...anchorProps
    } = props;
    void omittedChildren;
    void omittedVariant;
    void omittedClassName;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {
    children: omittedChildren,
    variant: omittedVariant,
    className: omittedClassName,
    ...buttonProps
  } = props;
  void omittedChildren;
  void omittedVariant;
  void omittedClassName;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;
