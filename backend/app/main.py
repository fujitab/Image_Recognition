from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
from PIL import Image
import io
from .services.gemini import analyze_image
from .config import settings

app = FastAPI(
    title=settings["IMAGE_RECOGNITION"],
    description="画像認識APIサービス",
    version=settings["0.0.1"]
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
    # ファイル形式の検証
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="画像ファイルのみアップロード可能です"
        )
    
    # ファイルサイズの検証
    contents = await file.read()
    if len(contents) > settings["MAX_FILE_SIZE"]:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"ファイルサイズは最大{settings['MAX_FILE_SIZE']/1024/1024}MBまでです"
        )
    
    # 画像を読み込む
    try:
        image = Image.open(io.BytesIO(contents))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="画像の読み込みに失敗しました。有効な画像ファイルを選択してください。"
        )
    
    # 一時ファイルとして保存（UUIDを使用してユニークなファイル名を生成）
    temp_dir = settings["TEMP_DIR"]
    file_extension = os.path.splitext(file.filename)[1]
    temp_filename = f"{uuid.uuid4()}{file_extension}"
    temp_path = os.path.join(temp_dir, temp_filename)
    
    try:
        # 一時ファイルに保存
        image.save(temp_path)
        
        # 画像分析を実行
        result = analyze_image(temp_path)
        
        # 成功レスポンスを返す
        return JSONResponse(
            content={
                "status": "success",
                "result": result
            }
        )
    except ValueError as e:
        # 入力値に関するエラー
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # その他のエラー
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        # 一時ファイルを削除
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass  # 一時ファイル削除のエラーは無視

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings["HOST"], port=settings["PORT"], reload=True)