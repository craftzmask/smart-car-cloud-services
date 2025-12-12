interface EmptyState {
  className?: string;
  message: string;
}

export function EmptyState({ className, message }: EmptyState) {
  return (
    <div className={`text-sm text-muted-foreground text-center ${className}`}>
      {message}
    </div>
  );
}
