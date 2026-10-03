import type { Paper } from '@/lib/posts';
import { typesetTitle } from '@/lib/keep-parens';
import { ExternalIcon } from './icons';

/**
 * The paper's metadata: title, authors, venue, then the links aligned under the
 * values. Sits at the top of the summary object (.summary), above 핵심 요약.
 */
export function PaperCard({ paper }: { paper: Paper }) {
  const links = [
    { href: paper.url, label: '논문' },
    { href: paper.pdf, label: 'PDF' },
    { href: paper.code, label: '코드' }
  ].filter((link): link is { href: string; label: string } => Boolean(link.href));

  return (
    <section className="paper-card" aria-label="논문 정보">
      <dl>
        <div>
          <dt>논문</dt>
          <dd className="paper-card__title">{typesetTitle(paper.title, 14)}</dd>
        </div>
        <div>
          <dt>저자</dt>
          <dd className="paper-card__authors">{paper.authors}</dd>
        </div>
        <div>
          <dt>발표</dt>
          <dd className="paper-card__venue">{paper.venue}</dd>
        </div>
      </dl>
      {links.length > 0 && (
        <p className="paper-card__links">
          {links.map((link) => (
            <a key={link.label} className="ink-link" href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
              <ExternalIcon />
            </a>
          ))}
        </p>
      )}
    </section>
  );
}
