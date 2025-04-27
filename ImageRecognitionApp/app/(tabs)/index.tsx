import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView,
  Button,
  Platform,
  Alert,
  Image,
  ScrollView
} from 'react-native';

// 画像認識機能
import * as ImagePicker from 'expo-image-picker';
import { analyzeImage } from '../../services/api';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 画像選択
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

  // 画像分析
  const handleAnalyze = async () => {
    if (!imageUri) return;
    
    try {
      setLoading(true);
      const response = await analyzeImage(imageUri);
      setResult(response);
    } catch (error) {
      console.error(error);
      Alert.alert('エラー', 'エラーが発生しました。再度お試しください。');
      setResult('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>画像認識アプリ</Text>
        
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>画像を選択してください</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <Button 
            title="画像を選択" 
            onPress={pickImage} 
            color="#3498db"
          />
          <Button 
            title="分析する" 
            onPress={handleAnalyze} 
            disabled={!imageUri || loading}
            color="#2ecc71"
          />
        </View>

        {loading && (
          <View style={styles.resultContainer}>
            <Text style={styles.loadingText}>分析中...</Text>
          </View>
        )}

        {result && !loading && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>分析結果:</Text>
            <ScrollView style={styles.resultScroll}>
              <Text style={styles.resultText}>{result}</Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
      
      <Text style={styles.footer}>
        Image Recognition App - v1.0
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60, // フッターの分の余白
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2c3e50',
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  resultContainer: {
    padding: 15,
    backgroundColor: '#ecf0f1',
    width: '100%',
    borderRadius: 10,
    height: 200,
    marginBottom: 20,
  },
  resultScroll: {
    flex: 1,
    marginTop: 5,
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#2c3e50',
  },
  resultText: {
    color: '#2c3e50',
    paddingBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: '#7f8c8d',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    color: '#7f8c8d',
  },
});
