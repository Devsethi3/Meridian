"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string | null;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "There was an error loading this section.",
  onRetry,
}) => {
  return (
    <Alert variant="destructive" className="border border-destructive/30">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-1">
        {description}
        {onRetry && (
          <div className="mt-3">
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;