import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function NFCReader() {
  const [hasNFC, setHasNFC] = useState(null);
  const [lastTagRead, setLastTagRead] = useState(null);

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
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setLastTagRead(JSON.stringify(tag, null, 2));
    } catch (error) {
      console.warn('Error reading NFC:', error);
      setLastTagRead('Error reading NFC tag');
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
      <Button title="Read NFC Tag" onPress={handleReadNFC} />
      {lastTagRead && (
        <View>
          <Text>Last Tag Read:</Text>
          <Text>{lastTagRead}</Text>
        </View>
      )}
    </View>
  );
}