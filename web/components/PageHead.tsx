import Link from "next/link";

export function PageHead({ eyebrow, title, lede, crumbs, children }: { eyebrow?: string; title: string; lede?: string; crumbs?: { href: string; label: string }[]; children?: React.ReactNode }) {
  return (
    <header className="pagehead">
      <div className="wrap">
        {crumbs && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs.map((c) => (<span key={c.href}> / <Link href={c.href}>{c.label}</Link></span>))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
