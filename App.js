import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Keyboard } from 'react-native';

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [data, setData] = useState(null); 

  useEffect(() => {
    fetch('https://api.apilayer.com/exchangerates_data/latest', {
      headers: {
        'apikey': '4dLTJVLNgCr2VGQYIWg6O4sZiT4O5YQd'
      }
    })
      .then(response => response.json())
      .then(data => {
        const currencyCodes = Object.keys(data.rates);
        setCurrencies(currencyCodes);
        setSelectedCurrency(currencyCodes[0]);
        setData(data);  // Added this line
      })
      .catch(error => {
        console.error("Virhe API-kutsussa:", error);
      });
  }, []);

  const handleConversion = () => {
    if (data && data.rates) {
    const rate = data.rates[selectedCurrency];
    const result = amount / rate;
    setConvertedAmount(result.toFixed(2));
    }
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
      {convertedAmount && <Text>Converted amount in EUR: {convertedAmount}</Text>}
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
});

