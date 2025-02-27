import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function MutationError({
  error,
  title = 'Heads up!',
}: {
  error: string;
  title?: string;
}) {
  if (typeof error !== 'string' || error.trim() === '') {
    return null;
  }
  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error.substr(0, 500)}</AlertDescription>
    </Alert>
  );
}
