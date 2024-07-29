export type FontSizeType =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

export type FontWeightType =
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type FontLeadingType = "none" | "tight" | "normal" | "relaxed";

export type TypographyProps = {
  size: FontSizeType;
  weight?: FontWeightType;
  children: string | React.ReactNode;
  className?: string;
  leading?: FontLeadingType;
  onClick?: () => void;
};

const Typography = ({
  size,
  children,
  weight,
  className = "",
  leading = "normal",
  onClick,
}: TypographyProps) => {
  const typographyClasses = `text-${size ?? "base"} font-${
    weight ?? 400
  } leading-${leading} ${className}`;

  return (
    <div className={typographyClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Typography;
