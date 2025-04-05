import os
from dotenv import load_dotenv

# .envファイルから環境変数をロード
load_dotenv()

# Gemini API設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEYが設定されていません。.envファイルを確認してください。")

# アプリケーション設定
APP_NAME = "画像認識API"
API_VERSION = "v1"