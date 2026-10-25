// Fallback when the live request fails. Sample values only, the app labels them
// "Demo rates, not live". Rounded from the ECB reference rates of 2026-10-23.
const demoRates = {
  base: 'EUR',
  date: '2026-10-23',
  rates: {
    AUD: 1.594,
    CAD: 1.567,
    CHF: 0.923,
    CNY: 7.466,
    CZK: 24.33,
    DKK: 7.475,
    GBP: 0.837,
    HUF: 366.7,
    JPY: 175.5,
    NOK: 10.47,
    PLN: 4.395,
    SEK: 11.13,
    USD: 1.119,
  },
};

export default demoRates;
