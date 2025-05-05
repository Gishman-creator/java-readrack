import sharp from 'sharp';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { file } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const fileBuffer = Buffer.from(file.data, 'base64');

      const convertedBuffer = await sharp(fileBuffer)
        .jpeg({ quality: 80 })
        .toBuffer();

      const base64Image = convertedBuffer.toString('base64');

      res.status(200).json({ image: base64Image });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to convert image' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
