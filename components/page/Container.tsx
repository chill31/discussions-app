export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <main className={`w-screen min-h-[650px] flex flex-col gap-12 overflow-x-hidden items-center justify-start py-10 ${className}`}>
      {children}
    </main>
  )
}