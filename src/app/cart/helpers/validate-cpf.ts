export const cpfIsValid = (cpf: string) => {
  const sanitized = cpf.replace(/\D/g, "");
  if (
    sanitized.length !== 11 ||
    [
      "00000000000",
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999",
    ].includes(sanitized)
  ) {
    return false;
  }

  let sum = 0;
  let weight = 10;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(sanitized.charAt(i), 10) * weight--;
  }
  let r = 11 - (sum % 11);
  const dig10 = r === 10 || r === 11 ? "0" : String(r);

  sum = 0;
  weight = 11;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(sanitized.charAt(i), 10) * weight--;
  }
  r = 11 - (sum % 11);
  const dig11 = r === 10 || r === 11 ? "0" : String(r);

  return dig10 === sanitized.charAt(9) && dig11 === sanitized.charAt(10);
};
