import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView,
  Button,
  Platform,
  Alert,
  Pressable,
  Dimensions
} from 'react-native';

// シンプルな画面にする - 画像選択関連は一時的にコメントアウト
// import * as ImagePicker from 'expo-image-picker';
// import { analyzeImage } from '../../services/api';

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // 画面のサイズをアラートで表示
  const showScreenInfo = () => {
    Alert.alert(
      'デバイス情報',
      `プラットフォーム: ${Platform.OS}\n画面幅: ${screenWidth}px\n画面高: ${screenHeight}px`
    );
  };

  // カウントアップとアラート表示
  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    Alert.alert('カウントアップ', `現在のカウント: ${newCount}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>タッチテスト</Text>
        
        <Text style={styles.countText}>カウント: {count}</Text>
        
        {/* 標準ボタン */}
        <Button 
          title="カウントアップ" 
          onPress={incrementCount} 
        />
        
        <View style={{height: 30}} />
        
        {/* デバイス情報表示 */}
        <Button 
          title="デバイス情報" 
          onPress={showScreenInfo} 
          color="#9b59b6"
        />
        
        <View style={{height: 50}} />
        
        {/* 大きなタップ領域 */}
        <Pressable
          style={({pressed}) => [
            styles.touchArea,
            {backgroundColor: pressed ? '#e74c3c' : '#3498db'}
          ]}
          onPress={incrementCount}
        >
          <Text style={styles.touchText}>
            ここをタップしてカウントアップ
          </Text>
        </Pressable>
        
        <View style={{height: 20}} />
        
        <Text style={styles.footer}>
          iOSテスト - v1.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2c3e50',
  },
  countText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#2c3e50',
  },
  touchArea: {
    width: '80%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
  },
  touchText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#7f8c8d',
  },
});
