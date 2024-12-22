import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform, Touchable, TouchableOpacity } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

export default function NFCReader() {
  const [hasNFC, setHasNFC] = useState(null);
  const [lastTagRead, setLastTagRead] = useState(null);
  const [statusMessage, setStatusMessage] = useState(''); // New state for status message

  useEffect(() => {
    checkNFC();
  }, []);

  const checkNFC = async () => {
    const supported = await NfcManager.isSupported();
    setHasNFC(supported);
    if (supported) {
      await NfcManager.start();
    }
  };

  const handleReadNFC = async () => {
    setStatusMessage('Bring the tag near...');
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag && tag.ndefMessage) {
        const ndefRecord = tag.ndefMessage[0];
        const payload = ndefRecord.payload;
        const text = Ndef.text.decodePayload(payload);
        setLastTagRead(text);
        setStatusMessage('Tag read successfully!');
      } else {
        setStatusMessage('No NDEF message found');
      }
    } catch (error) {
      console.warn('Error reading NFC:', error);
      setStatusMessage('Failed to read the tag. Try again.');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  if (hasNFC === null) {
    return <Text>Checking NFC capability...</Text>;
  }

  if (!hasNFC) {
    return <Text>This device doesn't support NFC</Text>;
  }

  return (
    <View>
      <TouchableOpacity onPress={handleReadNFC} >yo</TouchableOpacity>
      {statusMessage && (
        <Text style={{ marginTop: 10 }}>{statusMessage}</Text>
      )}
      {lastTagRead && (
        <View style={{ marginTop: 20 }}>
          <Text>Last Tag Read:</Text>
          <Text>{lastTagRead}</Text>
        </View>
      )}
    </View>
  );
}
