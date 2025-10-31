import express, { Request, Response } from 'express';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.send('翻訳サーバーが起動しています。/translate にPOSTしてください。')
})

interface MyMemoryResponseData {
    responseData: {
        translatedText: string;
    };
    responseStatus: 200;
}

app.post('/translate', async (req: Request, res: Response) => {
    console.log('--- /translate が呼び出されました (req.body):', req.body);

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
    
    console.log('外部APIを呼び出します:', apiUrl);

    const apiResponse = await axios.get(apiUrl);

    console.log('外部APIからの応答 (apiResponse.data):', apiResponse.data);

    if (apiResponse.data && apiResponse.data.responseStatus === 200) {
        const translatedText = apiResponse.data.responseData?.translatedText;
        if (translatedText) {
        console.log('翻訳成功:', translatedText);
        res.json({
            original: text,
            translated: translatedText,
            source: sourceLang,
            target: targetLang,
        });
        } else {
        throw new Error('MyMemory API responseData.translatedText not found');
        }
    } else {
        throw new Error(`MyMemory API error: ${apiResponse.data?.responseDetails || 'Unknown error'}`);
    }

    } catch (error) {
    console.error('--- 翻訳エラー (catchブロック) ---');
    if (isAxiosError(error)) {
        console.error('Axios Error Code:', error.code);
        console.error('Axios Error Message:', error.message);
    } else if (error instanceof Error) {
        console.error('Generic Error Message:', error.message);
    } else {
        console.error('Unknown Error:', error);
    }
    res.status(500).json({ error: '翻訳処理中にエラーが発生しました'});
    }
});

app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});