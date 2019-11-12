import * as fs from 'fs';
import * as path from 'path';

export const deleteImage = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, '..', '..', filePath);

    fs.unlink(fullPath, (err) => err ? reject(err) : resolve());
  });
};
