import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { DEV_MACHINE_IP } from '../environment';

// プラットフォームに基づいてAPIのURLを選択
const API_URL = Platform.select({
  web: 'http://localhost:8001',
  ios: `http://${DEV_MACHINE_IP}:8001`,
  android: `http://${DEV_MACHINE_IP}:8001`,
  default: 'http://localhost:8001'
});

console.log('API_URL configured as:', API_URL);

/**
 * 画像を分析するAPI
 * @param imageUri - 画像のURI
 * @returns 分析結果のテキスト
 */
export async function analyzeImage(imageUri: string): Promise<string> {
  try {
    console.log('analyzeImage called with URI:', imageUri.substring(0, 30) + '...');

    // FormDataオブジェクトを作成
    const formData = new FormData();
    
    // 画像ファイル名を取得
    const filename = imageUri.split('/').pop() || 'image.jpg';
    console.log('Filename extracted:', filename);
    
    // 画像ファイルをFormDataに追加（プラットフォームによって処理を分ける）
    if (Platform.OS === 'web') {
      // Web環境では、fetchを使ってblobを取得
      console.log('Processing for web platform');
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('file', blob, filename);
    } else {
      // ネイティブ環境（iOS/Android）
      console.log('Processing for native platform:', Platform.OS);
      const fileType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      // @ts-ignore - FormDataの型定義の問題を無視
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: fileType,
      });
    }

    console.log('Sending request to:', `${API_URL}/analyze`);
    console.log('Platform:', Platform.OS);
    
    // APIリクエストを送信
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API response success, result length:', data.result?.length || 0);
    return data.result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
} 