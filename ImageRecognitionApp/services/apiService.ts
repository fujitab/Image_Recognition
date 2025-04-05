// services/apiService.ts

import * as FileSystem from 'expo-file-system';
import { API_URL } from '../constants/Config';

/**
 * 画像を分析して説明テキストを取得（仮実装）
 * 
 */
export const analyzeImage = async (imageUri: string): Promise<string> => {
  try {
    // バックエンドが未実装の場合はダミーレスポンスを返す
    console.log('分析する画像: ', imageUri);
    return "バックエンドAPIがまだ実装されていません。Pythonバックエンドの実装後にこの関数を更新します。";
    
  } catch (error) {
    console.error('画像分析に失敗しました:', error);
    if (error instanceof Error) {
      return `エラーが発生しました: ${error.message}`;
    }
    return 'エラーが発生しました。もう一度お試しください。';
  }
};