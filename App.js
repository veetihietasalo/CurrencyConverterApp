import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Keyboard } from 'react-native';

// Set in .env (see .env.example). Expo inlines EXPO_PUBLIC_ values into the JS bundle at build time.
const API_KEY = process.env.EXPO_PUBLIC_APILAYER_KEY;
if (!API_KEY) {
  throw new Error('EXPO_PUBLIC_APILAYER_KEY is not set. Copy .env.example to .env, add an apilayer key and restart Expo with `npx expo start --clear`.');
}

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // EUR is the API's default base, asked for explicitly so the label below can't drift from the data.
    fetch('https://api.apilayer.com/exchangerates_data/latest?base=EUR', {
      headers: {
        apikey: API_KEY
      }
    })
      .then(async response => {
        const body = await response.json();
        // A bad key or a used-up quota comes back as JSON without rates.
        if (!response.ok || !body.rates) {
          throw new Error(body.message || body.error?.info || `HTTP ${response.status}`);
        }
        return body;
      })
      .then(data => {
        const currencyCodes = Object.keys(data.rates);
        setCurrencies(currencyCodes);
        setSelectedCurrency(currencyCodes[0]);
        setData(data);
      })
      .catch(error => {
        console.error("Virhe API-kutsussa:", error);
        setError(`Could not load exchange rates: ${error.message}`);
      });
  }, []);

  const handleConversion = () => {
    const value = parseFloat(amount.replace(',', '.'));
    const rate = data?.rates[selectedCurrency];
    if (!rate || Number.isNaN(value)) {
      setConvertedAmount(null);
      return;
    }
    setConvertedAmount((value / rate).toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCurrency}
        onValueChange={(value) => setSelectedCurrency(value)}
      >
        {currencies.map(currency => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>
      <TextInput 
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        blurOnSubmit={true}
        style={styles.input}
      />
      <Button title="Convert" onPress={() => { handleConversion(); Keyboard.dismiss(); }} />
      {convertedAmount && <Text>Converted amount in {data.base || 'EUR'}: {convertedAmount}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    marginBottom: 60
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});

