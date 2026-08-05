export function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 p-6 ${className ?? ""}`}
    >
      {title && (
        <h2 className="mb-4 text-sm font-medium tracking-wide text-slate-400 uppercase">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
