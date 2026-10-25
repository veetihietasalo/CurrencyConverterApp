# CurrencyConverterApp

Expo app that converts an amount in a chosen currency to euros. Pick a currency, type an amount, tap Convert.

What it does:
- Loads the latest exchange rates from the apilayer Exchange Rates Data API when the app opens
- Lists every currency code from the response in a picker
- Converts the amount to EUR with the chosen rate, rounded to 2 decimals

Stack: JavaScript, React Native 0.72, Expo SDK 49, `@react-native-picker/picker`. All the code is in `App.js`.

Run it:

```
npm install
npm start
```

`npm start` runs `expo start`. `npm run android` and `npm run ios` are in `package.json` too. The project is on Expo SDK 49, so Expo Go has to be a version that supports SDK 49. The rates call needs an apilayer API key, it goes in the `apikey` header in `App.js`.

Status: course project, mobile programming at a university of applied sciences, September 2023. No tests.
