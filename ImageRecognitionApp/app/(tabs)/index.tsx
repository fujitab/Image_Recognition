import React, { useState } from 'react';
import { StyleSheet, View, Image, Button, Text, Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  // 画像URIの状態
  const [imageUri, setImageUri] = useState<string | null>(null);
  // 分析結果の状態
  const [result, setResult] = useState<string | null>(null);

  // 画像を選択
  const pickImage = async () => {
    // 写真ライブラリから画像を選択
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResult(null); // 結果をリセット
    }
  };

  // 仮の画像分析処理
  const analyzeImage = () => {
    if (!imageUri) {
      Alert.alert('画像を選択してください');
      return;
    }

    // 仮の分析結果（実際はここでAPIを呼ぶ）
    setResult('これは仮の分析結果です。バックエンドの実装後に実際の分析が行われます。');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>画像認識アプリ</Text>
        
        {/* 画像表示 */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text>画像を選択してください</Text>
          )}
        </View>

        {/* ボタン */}
        <View style={styles.buttons}>
          <Button title="画像を選択" onPress={pickImage} />
          <Button 
            title="分析する" 
            onPress={analyzeImage} 
            disabled={!imageUri} 
          />
        </View>

        {/* 結果表示 */}
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
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
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
    borderRadius: 5,
    width: '100%',
  },
});
