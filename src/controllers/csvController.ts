import { Request, Response } from 'express';
import { csvUtils } from '../utils/csvUtils';
import path from 'path';
import fs from 'fs';

export const uploadFile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const filePath = path.join(__dirname, '../../uploads', req.file.filename);

  try {
    const parsedData = await csvUtils(filePath);
    console.log(parsedData);
    fs.unlinkSync(filePath);//delete file
    res.status(200).json(parsedData);
  } catch (error) {
    res.status(500).send('Error parsing the CSV file.');
  }
};
