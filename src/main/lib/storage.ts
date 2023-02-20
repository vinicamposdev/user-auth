import { Readable } from 'stream';
import { Request } from 'express';
import * as multiparty from 'multiparty';
import { S3 } from 'aws-sdk';
import * as mime from 'mime-types';
import { createReadStream, readFileSync } from 'fs';
import * as archiver from 'archiver';

// Create S3 service object
export const s3 = new S3({ apiVersion: '2006-03-01' });

/** Check if a file exists in the bucket */
export const keyExists = async (key: string, bucket: string): Promise<boolean> => {
  const params = { Bucket: bucket, Key: key };
  try {
    const isThere = await s3.headObject(params).promise();
    return true;
  } catch (error) {
    return false;
  }
};

/** Upload a file to the bucket */
export function upload(key: string, req: Request, bucket: string): Promise<any> {
  // parse a file upload
  const form = new multiparty.Form();

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      }
      if (!files || !files.file || !files.file[0]) {
        reject('No file to upload');
      }
      const file = files.file[0];
      const params = {
        Bucket: bucket,
        Key: key,
        Body: createReadStream(file.path),
        ContentType: mime.lookup(file.originalFilename) || 'application/octet-stream',
      };
      s3.upload(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve({ key: params.Key });
        }
      });
    });
  });
}
/** Download a file from the bucket */
export function download(key: string, bucket: string): Readable {
  const params = { Bucket: bucket, Key: key };
  return s3.getObject(params).createReadStream();
}

export function downloadZip(files: Array<any>, bucket: string) {
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  files.forEach((file: any) => {
    const params = { Bucket: bucket, Key: file.key };
    const readStream = s3.getObject(params).createReadStream();

    archive.append(readStream, { name: file.name, prefix: 'files' });
  });

  return archive;
}
