"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "Nothing to show",
  description = "There is no data to display here yet.",
}) => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-10 text-center text-muted-foreground">
        {icon ? <div className="mb-3 flex justify-center">{icon}</div> : null}
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
