import { cn } from "@/lib/utils";

export function LotusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn("w-6 h-6", props.className)}
      {...props}
    >
        <path d="M12 2c-3.33 4-5 8-5 11.5C7 16.83 8.67 19 12 19s5-2.17 5-5.5c0-3.5-1.67-7.5-5-11.5z"/>
        <path d="M4.5 13C2.5 11 2.5 7.5 4.5 5.5s5.5 2 8.5 2c3 0 6.5 0 8.5-2s2 2.5 0 4.5c-2 2-5 3.5-8.5 3.5s-6.5-1.5-8.5-3.5z"/>
    </svg>
  );
}
