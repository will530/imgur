import { ImgurClient } from '../client';
import {
  createForm,
  getImgurApiResponseFromResponse,
  // getSource,
} from '../common/utils';
import { Payload, ImgurApiResponse, ImageData } from '../common/types';
import { UPLOAD_ENDPOINT, IMAGE_ENDPOINT } from '../common/endpoints';

export async function upload(
  client: ImgurClient,
  payload: Payload | Payload[]
): Promise<ImgurApiResponse<ImageData> | ImgurApiResponse<ImageData>[]> {
  payload = Array.isArray(payload) ? payload : [payload];
  const promises = payload.map((p: Payload) => {
    const form = createForm(p);
    const isVideo =
      p.type === 'stream' &&
      (typeof p.image === 'string'
        ? p.image.indexOf('.mp4') !== -1
        : (p.image as any).path.indexOf('.mp4') !== -1);
    const url = isVideo ? UPLOAD_ENDPOINT : IMAGE_ENDPOINT;

    /* eslint no-async-promise-executor: 0 */
    return new Promise(async (resolve) => {
      resolve(
        getImgurApiResponseFromResponse(
          await client.request({
            url,
            method: 'POST',
            data: form,
            headers: form.getHeaders(),
            onUploadProgress: (progressEvent) => {
              console.log({ progressEvent });
              client.emit('uploadProgress', { ...progressEvent });
            },
          })
        ) as ImgurApiResponse<ImageData>
      );
    }) as Promise<ImgurApiResponse<ImageData>>;
  });
  return await Promise.all(promises);
}
