export default function Title({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h1 className={`text-[3.8rem] text-center max-sm:text-[3.2rem] font-extrabold ${className}`}>{children}</h1>
}