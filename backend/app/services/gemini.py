import os
import sys
import google.generativeai as genai
from PIL import Image
from ..config import settings

def analyze_image(image_path):
    """
    指定された画像をGemini APIで分析する関数
    
    Args:
        image_path (str): 分析する画像ファイルのパス
        
    Returns:
        str: 分析結果のテキスト
        
    Raises:
        ValueError: APIキーが設定されていない、または画像ファイルが存在しない場合
        Exception: API呼び出し時に発生したその他のエラー
    """
    
    # APIキーの確認
    api_key = settings["GEMINI_API_KEY"]
    if not api_key:
        raise ValueError("GEMINI_API_KEYが設定されていません。")
    
    # 画像ファイルの存在確認
    if not os.path.exists(image_path):
        raise ValueError(f"画像ファイル '{image_path}' が見つかりません。")
    
    # Gemini APIの設定
    genai.configure(api_key=api_key)
    
    try:
        # 画像の読み込み
        image = Image.open(image_path)
        
        # モデルの初期化
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # プロンプトの設定
        prompt = "この画像に何が写っているか詳しく説明してください。日本語で回答してください。"
        
        # 画像分析の実行
        response = model.generate_content([prompt, image])
        
        # 結果を返す
        return response.text
        
    except Exception as e:
        # エラーの詳細情報を含めて例外を再発生
        raise Exception(f"画像分析中にエラーが発生しました: {str(e)}")

if __name__ == "__main__":
    # コマンドライン引数から画像パスを取得、なければデフォルト値を使用
    image_path = sys.argv[1] if len(sys.argv) > 1 else "sandbox/images/sample.jpg"
    
    print(f"=== Gemini Vision APIテスト ===")
    try:
        result = analyze_image(image_path)
        print("\n=== 分析結果 ===")
        print(result)
    except Exception as e:
        print(str(e))