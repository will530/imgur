import { ImgurClient } from '../client';
import { ALBUM_ENDPOINT } from '../common/endpoints';
import { ImgurApiResponse, AlbumData } from '../common/types';
import { createForm, getImgurApiResponseFromResponse } from '../common/utils';

export async function createAlbum(
  client: ImgurClient,
  title?: string,
  description?: string
): Promise<ImgurApiResponse<AlbumData>> {
  const form = createForm({ title, description });
  const response = await client
    .request({
      url: ALBUM_ENDPOINT,
      headers: form.getHeaders(),
      method: 'POST',
      data: form,
    })
    .catch((e) => e.response);

  if (response.data?.success && response.data?.data) {
    response.data.data.title = title;
    response.data.data.description = description;
  }
  return getImgurApiResponseFromResponse(
    response
  ) as ImgurApiResponse<AlbumData>;
}
