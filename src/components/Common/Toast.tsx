interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className={`toast${message ? ' toast--visible' : ''}`} role="status">
      {message}
    </div>
  );
}
