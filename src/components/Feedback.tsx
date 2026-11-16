import { useT } from '../preferences/LocaleProvider';
import { Button } from './Button';
import { AlertCircle, LoaderCircle, Search } from 'lucide-react';
import { errorMessage } from '../lib/api';

export function Loading({ label }: { label?: string }) {
  const t = useT();
  return (
    <div className="state" role="status">
      <LoaderCircle className="spin" size={24} />
      <p>{label ?? t('ui.loading_your_workspace')}</p>
    </div>
  );
}

export function ErrorState({ error, retry }: { error: unknown; retry?: () => void }) {
  const t = useT();
  return (
    <div className="state error-state" role="alert">
      <AlertCircle size={25} />
      <p>{errorMessage(error)}</p>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          {' '}
          {t('ui.try_again')}{' '}
        </Button>
      )}
    </div>
  );
}

export function Empty({ title, description }: { title?: string; description?: string }) {
  const t = useT();
  return (
    <div className="state">
      <Search size={27} />
      <h3>{title ?? t('ui.nothing_here_yet')}</h3>
      <p>{description ?? t('ui.try_adjusting_your_filters')}</p>
    </div>
  );
}
