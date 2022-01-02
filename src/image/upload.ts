import { ImgurClient } from '../client';
import {
  createForm,
  getImgurApiResponseFromResponse,
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
    const image = p.image as any;
    const filename =
      typeof image === 'string' ? image : image.path ?? image.name;
    const isVideo =
      p.type === 'stream' &&
      (filename.indexOf('.mp4') !== -1 || filename.indexOf('.avi') !== -1);
    const url = isVideo ? UPLOAD_ENDPOINT : IMAGE_ENDPOINT;

    /* eslint no-async-promise-executor: 0 */
    return new Promise(async (resolve) => {
      resolve(
        getImgurApiResponseFromResponse(
          await client
            .request({
              url,
              method: 'POST',
              data: form,
              headers: form.getHeaders(),
              onUploadProgress: (progressEvent) => {
                console.log({ progressEvent });
                client.emit('uploadProgress', { ...progressEvent });
              },
            })
            .catch((e) => e.response)
        ) as ImgurApiResponse<ImageData>
      );
    }) as Promise<ImgurApiResponse<ImageData>>;
  });
  return await Promise.all(promises);
}
