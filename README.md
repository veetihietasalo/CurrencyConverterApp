# CurrencyConverterApp

Expo app that converts an amount in a chosen currency to euros. Pick a currency, type an amount, tap Convert. Runs on a phone and as a web page.

What it does:
- Loads the latest ECB reference rates through [Frankfurter](https://frankfurter.dev) when it opens (`/v1/latest?base=EUR`, about 30 currencies, updated each working day, no API key)
- Lists the currency codes in a picker and shows the date of the rates
- Converts the amount to EUR (amount / rate, since every rate is per 1 EUR), rounded to 2 decimals. A comma works as the decimal mark
- If the request fails, falls back to a small table of sample rates in `demoRates.js` and says "Demo rates, not live"

The course version in 2023 used the apilayer Exchange Rates Data API, which needs a key. It was switched to Frankfurter in October 2026, so nothing secret is needed to run it.

Stack: JavaScript, React Native 0.72, Expo SDK 49, `@react-native-picker/picker`, react-native-web for the web build. The app is `App.js` + `demoRates.js`.

Run it on a phone:

```
npm install
npm start
```

`npm run android` and `npm run ios` are in `package.json` too. Expo Go from the app stores only runs the latest SDK, so running it on a phone now needs an SDK upgrade first.

Web build:

```
npm run build:web     # static site in dist/
npm run deploy:web    # build:web, then push dist/ to the gh-pages branch
```

`build:web` runs `expo export --platform web` and then `scripts/web-relative-paths.js`, which makes the paths relative (SDK 49 has no base URL setting) and writes `.nojekyll`, so the site works from `https://veetihietasalo.github.io/CurrencyConverterApp/`. `deploy:web` runs `scripts/deploy-web.sh`, which builds the gh-pages branch from `dist/` only and pushes it without force. GitHub Pages has to be set to the gh-pages branch once in the repo settings. To try the build locally, copy `dist/` to `site/CurrencyConverterApp/`, run `python3 -m http.server -d site` and open `http://localhost:8000/CurrencyConverterApp/`.

Review, Oct 2026:
- The apilayer key was hard-coded in `App.js`. It's revoked and the app no longer needs a key at all. The old value is still in git history, it's dead.
- The rates call had no base and the result was labelled EUR. EUR was the API's default, so the numbers were right. Frankfurter is asked for `base=EUR` explicitly and the label reads the base from the response.
- A failed rates call threw a TypeError that only reached the console. Now the app falls back to the labelled sample rates.
- "12,5" converted to NaN. Commas work now, and an empty amount shows nothing instead of 0.00.

Still open:
- No tests. Not run on a phone or emulator in this review, only bundled with `npx expo export` for Android, iOS and the web. The web build was checked in headless Chromium.
- The dependencies are the 2023 SDK 49 set. `npx expo install --check` wants react-native 0.72.10 (we have 0.72.5) and npm audit lists advisories in that tree. The fix is an SDK upgrade.

Status: course project, mobile programming at a university of applied sciences, September 2023. Key removed, review fixes and web build in October 2026.
