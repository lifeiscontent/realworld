interface ErrorMessagesProps {
  messages: ReadonlyArray<string> | undefined;
}

/** The list of validation and API errors. Screen readers announce it. */
export function ErrorMessages({ messages = [] }: ErrorMessagesProps) {
  if (!messages.length) return null;

  return (
    <div role="alert">
      <ul className="error-messages">
        {messages.map(message => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
