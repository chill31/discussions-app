export default function Paragraph({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-center mx-4 max-sm:mx-2 ${className}`}>{children}</p>
}