import { AlertCircle, LoaderCircle, Search } from 'lucide-react';
import { errorMessage } from '../lib/api';

export function Loading({ label = 'Loading your workspace…' }: { label?: string }) {
  return (
    <div className="state" role="status">
      <LoaderCircle className="spin" size={24} />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ error, retry }: { error: unknown; retry?: () => void }) {
  return (
    <div className="state error-state" role="alert">
      <AlertCircle size={25} />
      <p>{errorMessage(error)}</p>
      {retry && (
        <button className="button secondary" onClick={retry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Empty({
  title = 'Nothing here yet',
  description = 'Try adjusting your filters.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="state">
      <Search size={27} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
