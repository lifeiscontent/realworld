export function buildAuthorizationResult({
  value = false,
  message,
  reasons,
} = {}) {
  return {
    message,
    reasons,
    value,
  };
}
