export function validateCardNumber(cardNumber: string) {
    const cleanedCardNumber = cardNumber.replace(/\s+/g, ''); // видаляє всі пробіли

    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const masterCardRegex = /^(?:5[1-5][0-9]{14}|2(?:2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/;

    return visaRegex.test(cleanedCardNumber) || masterCardRegex.test(cleanedCardNumber);
}