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

# サーバー設定
HOST = "0.0.0.0"
PORT = 8001

# 一時ファイル設定
TEMP_DIR = "temp"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

# 画像設定
ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# CORS設定
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # 開発環境
    "http://localhost:19006",  # Expo Web
    "http://localhost:8081",   # Expo Metro
    "http://127.0.0.1:8001",   # バックエンドIP直接アクセス
    "http://127.0.0.1:19006",  # Expo Web (IP)
    "exp://localhost:19000",   # Expo開発サーバー
    "*"                       # 開発中は全てのオリジンを許可（本番環境では使用しないでください）
]

# 全ての設定値をまとめた辞書
settings = {
    "GEMINI_API_KEY": GEMINI_API_KEY,
    "APP_NAME": APP_NAME,
    "API_VERSION": API_VERSION,
    "HOST": HOST,
    "PORT": PORT,
    "TEMP_DIR": TEMP_DIR,
    "ALLOWED_IMAGE_TYPES": ALLOWED_IMAGE_TYPES,
    "MAX_FILE_SIZE": MAX_FILE_SIZE,
    "ALLOWED_ORIGINS": ALLOWED_ORIGINS
}