import { cn } from "@/lib/utils";

export const AnimatedGradientText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-full px-4 py-1.5 font-medium shadow-[0_0_1rem_0_rgba(81,43,129,0.2)] transition-shadow duration-500 hover:shadow-[0_0_2rem_0_rgba(81,43,129,0.3)]",
        className
      )}
    >
      <div
        className="absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[#512B81]/20 via-[#9A64B5]/20 to-[#512B81]/20 bg-[length:var(--bg-size)_100%] rounded-full"
        style={
          {
            "--bg-size": "300%",
          } as React.CSSProperties
        }
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
