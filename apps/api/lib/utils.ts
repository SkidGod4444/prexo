export function generateContainerKey(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `con_${randomDigits}`;
}
