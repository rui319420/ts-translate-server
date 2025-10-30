import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const POST = 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.send('翻訳サーバーが起動しています。/trans')
})

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
        )}&Langpair=${sourceLang}|${targetLang}`;
        
        const apiResponse = await axios.get(apiUrl);
        const translatedText = apiResponse.data.responseData.translatedText;

        res.json({
            original: text,
            translated: translatedText,
            source: sourceLang,
            target: targetLang,
        });
        
    }catch (error) {
        console.error('翻訳エラー', error);
        res.status(500).json({ error: '翻訳所りちゅにエラーが発生しました'});
    }
});

app.listen(POST, () => {
    console.log(`サーバーが http://localhost:${POST} で起動しました`);
});