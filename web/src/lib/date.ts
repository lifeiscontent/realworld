const longDate = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
});

function ordinal(day: number): string {
  const lastTwo = day % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/** Formats a date like the RealWorld templates, for example "January 20th". */
export function formatDate(value: string): string {
  const date = new Date(value);
  const month = longDate
    .formatToParts(date)
    .find(part => part.type === 'month');
  return `${month?.value ?? ''} ${ordinal(date.getDate())}`;
}
