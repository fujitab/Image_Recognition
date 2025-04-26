import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:8001';  // バックエンドのポートを8001に修正

/**
 * 画像を分析するAPI
 * @param imageUri - 画像のURI
 * @returns 分析結果のテキスト
 */
export async function analyzeImage(imageUri: string): Promise<string> {
  try {
    // FormDataオブジェクトを作成
    const formData = new FormData();
    
    // 画像ファイル名を取得
    const filename = imageUri.split('/').pop() || 'image.jpg';
    
    // 画像ファイルをFormDataに追加（プラットフォームによって処理を分ける）
    if (Platform.OS === 'web') {
      // Web環境では、fetchを使ってblobを取得
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('file', blob, filename);
    } else {
      // ネイティブ環境（iOS/Android）
      const fileType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      // @ts-ignore - FormDataの型定義の問題を無視
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: fileType,
      });
    }

    console.log('Sending request to:', `${API_URL}/analyze`);
    
    // APIリクエストを送信
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
} 