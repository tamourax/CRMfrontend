import { useT, useLocale } from '../preferences/LocaleProvider';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { money, titleCase } from '../lib/format';
import type { AiResult } from '../types';

export function AiContent({ result }: { result: AiResult }) {
  const t = useT();
  const { locale } = useLocale();
  const scalarFacts = Object.entries(result.facts).filter(
    ([, value]) => typeof value === 'number' || typeof value === 'string',
  );
  return (
    <div className="ai-content">
      <div className="verified-label">
        <span /> {t('ui.grounded_in_your_crm_records')}{' '}
      </div>
      {scalarFacts.length > 0 && (
        <div className="fact-grid">
          {scalarFacts.map(([key, value]) => (
            <div key={key}>
              <span>
                {t('facts.' + key) === 'facts.' + key ? titleCase(key) : t('facts.' + key)}
              </span>
              <strong>
                {/value|amount/.test(key) && /^\d+(\.\d+)?$/.test(String(value))
                  ? money(String(value))
                  : ['stage', 'ranking_metric'].includes(key)
                    ? t((key === 'stage' ? 'ui.' : 'facts.') + value)
                    : String(value)}
              </strong>
            </div>
          ))}
        </div>
      )}
      {result.sections.map((section, index) => (
        <section className="ai-section" key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </section>
      ))}
      {result.limitations.map((limitation, index) => (
        <p className="note" key={index}>
          {limitation}
        </p>
      ))}
      {result.sources.length > 0 && (
        <div className="sources">
          <span>{t('ui.sources')}</span>
          {result.sources.map((source, index) =>
            source.type !== 'aggregate' && source.id ? (
              <Link
                key={index}
                to={`/${source.type === 'deal' ? 'deals' : 'customers'}/${source.id}`}
              >
                {source.label}
                <ArrowUpRight size={12} />
              </Link>
            ) : (
              <span className="source-chip" key={index}>
                {source.label}
              </span>
            ),
          )}
        </div>
      )}
      <small className="muted">
        {' '}
        {t('ui.generated')}{' '}
        {new Date(result.generated_at).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}{' '}
        {t('ui.review_recommendations_before_acting')}{' '}
      </small>
    </div>
  );
}
