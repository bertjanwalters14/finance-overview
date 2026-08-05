export function ExportLink({ href }: { href: string }) {
  return (
    <a href={href} className="text-sm text-emerald-400 hover:underline">
      Download CSV
    </a>
  );
}
