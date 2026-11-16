import { PanelHeading, Panel } from './Panel';

import { Button } from './Button';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useAiSummary } from '../hooks/useAiSummary';
import { useLocale } from '../preferences/LocaleProvider';
import { ErrorState } from './Feedback';
import { AiContent } from './AiContent';

export function AiPanel({
  endpoint,
  title,
  description,
}: {
  endpoint: string;
  title: string;
  description: string;
}) {
  const mutation = useAiSummary(endpoint);
  const { locale } = useLocale();
  const reset = mutation.reset;
  useEffect(() => {
    reset();
  }, [endpoint, locale, reset]);
  return (
    <Panel className="ai-panel">
      <PanelHeading>
        <div className="ai-heading">
          <span className="ai-icon">
            <Sparkles size={20} />
          </span>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <Button variant="primary" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? (
            <LoaderCircle className="spin" size={16} />
          ) : (
            <Sparkles size={16} />
          )}{' '}
          {mutation.isPending ? 'Analyzing…' : mutation.data ? 'Regenerate' : 'Generate summary'}
        </Button>
      </PanelHeading>
      {mutation.isError && <ErrorState error={mutation.error} retry={() => mutation.mutate()} />}{' '}
      {mutation.data && <AiContent result={mutation.data} />}{' '}
    </Panel>
  );
}
