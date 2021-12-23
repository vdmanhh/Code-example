export const formatAddress = (address: string, first = 10, last = -4) => {
  if (!address) return '';
  return `${address.slice(0, first)}...${address.slice(last)}`;
};
