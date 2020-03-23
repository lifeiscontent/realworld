const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ordinalSuffixOf = i => {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) return `${i}st`;
  if (j == 2 && k != 12) return `${i}nd`;
  if (j == 3 && k != 13) return `${i}rd`;
  return `${i}th`;
};

export function format(date, format) {
  switch (format) {
    case 'MMM Qo':
      return `${months[date.getMonth()].substr(0, 3)} ${ordinalSuffixOf(
        date.getDate()
      )}`;
    case 'MMMM Qo':
      return `${months[date.getMonth()]} ${ordinalSuffixOf(date.getDate())}`;
    default:
      throw new TypeError(`format ${format} not implemented`);
  }
}
