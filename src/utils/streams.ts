import { Readable } from 'stream';

/**
 * Convert a stream into a buffer
 *
 * @param stream: Readable
 * @returns Promise<Buffer>
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
