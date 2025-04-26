from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
from PIL import Image
import io
import logging
from .services.gemini import analyze_image
from .config import settings

# ロガーの設定
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()  # コンソールに出力
    ]
)
logger = logging.getLogger("image_recognition")

app = FastAPI(
    title="Image Recognition",
    description="画像認識APIサービス",
    version="0.0.1"
)

# CORSの設定 
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings["ALLOWED_ORIGINS"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """APIのルートエンドポイント"""
    logger.info("ルートエンドポイントにアクセスされました")
    return {"message": "Image Recognition API is running"}

@app.post("/analyze")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    """
    画像をアップロードして分析するエンドポイント
    
    Args:
        file (UploadFile): アップロードされた画像ファイル
    
    Returns:
        JSONResponse: 分析結果
    """
    logger.info(f"画像分析リクエスト受信: ファイル名={file.filename}, タイプ={file.content_type}")
    
    # ファイル形式の検証
    if not file.content_type.startswith('image/'):
        logger.warning(f"無効なファイル形式: {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="画像ファイルのみアップロード可能です"
        )
    
    # ファイルサイズの検証
    contents = await file.read()
    file_size = len(contents)
    logger.debug(f"ファイルサイズ: {file_size} バイト")
    
    if file_size > settings["MAX_FILE_SIZE"]:
        logger.warning(f"ファイルサイズ超過: {file_size} バイト > {settings['MAX_FILE_SIZE']} バイト")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"ファイルサイズは最大{settings['MAX_FILE_SIZE']/1024/1024}MBまでです"
        )
    
    # 画像を読み込む
    try:
        logger.debug("画像データをPILイメージに変換中...")
        image = Image.open(io.BytesIO(contents))
        logger.debug(f"画像形式: {image.format}, サイズ: {image.size}, モード: {image.mode}")
    except Exception as e:
        logger.error(f"画像読み込みエラー: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="画像の読み込みに失敗しました。有効な画像ファイルを選択してください。"
        )
    
    # 一時ファイルとして保存（UUIDを使用してユニークなファイル名を生成）
    temp_dir = settings["TEMP_DIR"]
    file_extension = os.path.splitext(file.filename)[1]
    temp_filename = f"{uuid.uuid4()}{file_extension}"
    temp_path = os.path.join(temp_dir, temp_filename)
    
    logger.debug(f"一時ファイルに保存: {temp_path}")
    
    try:
        # 一時ファイルに保存
        image.save(temp_path)
        logger.debug("一時ファイルへの保存成功")
        
        # 画像分析を実行
        logger.info("画像分析を開始...")
        result = analyze_image(temp_path)
        logger.info("画像分析完了")
        logger.debug(f"分析結果: {result}")
        
        # 成功レスポンスを返す
        return JSONResponse(
            content={
                "status": "success",
                "result": result
            }
        )
    except ValueError as e:
        logger.error(f"入力値エラー: {str(e)}")
        # 入力値に関するエラー
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"予期せぬエラー: {str(e)}", exc_info=True)
        # その他のエラー
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        # 一時ファイルを削除
        if os.path.exists(temp_path):
            try:
                logger.debug(f"一時ファイルを削除: {temp_path}")
                os.remove(temp_path)
            except Exception as e:
                logger.warning(f"一時ファイル削除エラー: {str(e)}")
                pass  # 一時ファイル削除のエラーは無視

if __name__ == "__main__":
    import uvicorn
    logger.info(f"サーバー起動: {settings['HOST']}:{settings['PORT']}")
    uvicorn.run("app.main:app", host=settings["HOST"], port=settings["PORT"], reload=True)