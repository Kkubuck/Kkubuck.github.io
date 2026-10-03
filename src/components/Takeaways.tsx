import { keepParens } from '@/lib/keep-parens';

/** 핵심 요약: numbered takeaways under a hairline, the lower half of the summary object. */
export function Takeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="takeaways" aria-labelledby="takeaways-title">
      <h2 id="takeaways-title" className="takeaways__title">
        핵심 요약
      </h2>
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {/* One grid item beside the number, however many kept words it holds. */}
            <span>{keepParens(item)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
