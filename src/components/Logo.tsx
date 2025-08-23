import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  priority?: boolean;
}

interface SizeConfig {
  container: string;
  image: {
    width: number;
    height: number;
  };
  text: string;
  gap: string;
}

// Size configurations for different logo variants
const sizeConfigs: Record<NonNullable<LogoProps["size"]>, SizeConfig> = {
  sm: {
    container: "flex items-center",
    image: { width: 16, height: 16 },
    text: "text-sm",
    gap: "gap-1.5",
  },
  md: {
    container: "flex items-center",
    image: { width: 20, height: 20 },
    text: "text-base",
    gap: "gap-2",
  },
  lg: {
    container: "flex items-center",
    image: { width: 24, height: 24 },
    text: "text-lg",
    gap: "gap-2.5",
  },
  xl: {
    container: "flex items-center",
    image: { width: 32, height: 32 },
    text: "text-xl",
    gap: "gap-3",
  },
};

const Logo: React.FC<LogoProps> = ({
  size = "lg",
  className,
  showText = true,
  priority = false,
}) => {
  const config = sizeConfigs[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("flex items-center font-semibold", config.gap)}>
        {/* Light mode logo */}
        <Image
          src="/logo-light.svg"
          width={config.image.width}
          height={config.image.height}
          alt="Meridian logo"
          className="block dark:hidden"
          priority={priority}
        />

        {/* Dark mode logo */}
        <Image
          src="/logo-dark.svg"
          width={config.image.width}
          height={config.image.height}
          alt="Meridian logo"
          className="hidden dark:block"
          priority={priority}
        />

        {/* Brand text */}
        {showText && (
          <span
            className={cn(
              "bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40",
              config.text
            )}
          >
            Meridian
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
