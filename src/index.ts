import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.send('翻訳サーバーが起動しています。/translate にPOSTしてください。')
})

interface MyMemoryResponseData {
    responseData: {
        translatedText: string;
    };
}

app.post('/translate', async (req: Request, res: Response) => {
    try {
        const { text, source, target } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'text is required' });
        }

        const sourceLang = source || 'en';
        const targetLang = target || 'ja';

        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text
        )}&langpair=${sourceLang}|${targetLang}`;
        
        const apiResponse: AxiosResponse<MyMemoryResponseData> = await axios.get(apiUrl);
        const translatedText = apiResponse.data.responseData.translatedText;

        res.json({
            original: text,
            translated: translatedText,
            source: sourceLang,
            target: targetLang,
        });
        
    }catch (error) {
        console.error('翻訳エラー', error);
        res.status(500).json({ error: '翻訳処理中にエラーが発生しました'});
    }
});

app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});