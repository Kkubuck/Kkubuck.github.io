import Link from 'next/link';
import { WORDMARK } from '@/lib/metadata';
import { Dock } from './shell/Dock';

/** Masthead: the wordmark only (no tagline, no intro copy), plus the floating dock. */
export function Header() {
  return (
    <header className="site-header">
      <div className="wrap masthead" id="masthead">
        <Link className="wordmark" href="/">
          <span className="wordmark__name">{WORDMARK.name}</span> <span className="wordmark__suffix">{WORDMARK.suffix}</span>
        </Link>
      </div>
      <Dock mastheadId="masthead" />
    </header>
  );
}
