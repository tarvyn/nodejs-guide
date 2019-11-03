import { unlink } from 'fs';

export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    unlink(filePath, (err) => {
      if (err) {
        reject(err.toString());
      }
      resolve();
    });
  })
};
