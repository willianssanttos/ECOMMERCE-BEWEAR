export const cnpjIsValid = (cnpj: string): boolean => {
  const sanitized = cnpj.replace(/\D/g, "");
  if (
    sanitized.length !== 14 ||
    [
      "00000000000000",
      "11111111111111",
      "22222222222222",
      "33333333333333",
      "44444444444444",
      "55555555555555",
      "66666666666666",
      "77777777777777",
      "88888888888888",
      "99999999999999",
    ].includes(sanitized)
  ) {
    return false;
  }

  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(sanitized.charAt(i), 10) * weight;
    weight++;
    if (weight === 10) weight = 2;
  }
  let r = sum % 11;
  const dig13 = r === 0 || r === 1 ? "0" : String(11 - r);

  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(sanitized.charAt(i), 10) * weight;
    weight++;
    if (weight === 10) weight = 2;
  }
  r = sum % 11;
  const dig14 = r === 0 || r === 1 ? "0" : String(11 - r);

  return dig13 === sanitized.charAt(12) && dig14 === sanitized.charAt(13);
};
