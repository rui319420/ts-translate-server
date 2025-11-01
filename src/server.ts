import express from 'express';
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());

app.use(express.json());

app.post('/api/translate', (req, res) => {

    const textToTranslate = req.body.text;

    console.log(`[サーバー受信] 翻訳リクエスト: "${textToTranslate}"`);

    const translatedText = `[仮翻訳] ${textToTranslate}`;

    res.json({
        translatedText: translatedText
    });
});

app.listen(port, () => {
    console.log(`バックエンドサーバーが http://localhost:${port} で起動しました`);
});