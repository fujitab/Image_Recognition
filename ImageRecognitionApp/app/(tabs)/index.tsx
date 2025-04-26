import React, { useState } from 'react';
import { StyleSheet, View, Image, Button, Text, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImage } from '../../services/api';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;
    try {
      const response = await analyzeImage(imageUri);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('エラーが発生しました');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text>画像を選択してください</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <Button title="画像を選択" onPress={pickImage} />
          <Button title="分析する" onPress={handleAnalyze} disabled={!imageUri} />
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text>{result}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  resultContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
});
