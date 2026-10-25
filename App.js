import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Keyboard } from 'react-native';

// ECB reference rates through Frankfurter: free, no key, CORS allowed, updated each working day.
// With base=EUR every rate is units of that currency per 1 EUR.
const RATES_URL = 'https://api.frankfurter.dev/v1/latest?base=EUR';

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(RATES_URL)
      .then(async response => {
        const body = await response.json();
        if (!response.ok || !body.rates) {
          throw new Error(body.message || `HTTP ${response.status}`);
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
    // rate = units of the chosen currency per 1 EUR, so the amount in EUR is amount / rate.
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
      {data && <Text style={styles.source}>ECB reference rates from {data.date}, via Frankfurter</Text>}
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
  source: {
    color: 'gray',
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});

