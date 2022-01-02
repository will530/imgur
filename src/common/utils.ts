import { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { ImgurApiResponse, Payload } from './types';

export function createForm(payload: string | Payload): FormData {
  const form = new FormData();

  if (typeof payload === 'string') {
    form.append('image', payload);
    return form;
  }

  for (const [key, value] of Object.entries(payload)) {
    const supportedUploadObjectTypes = ['base64', 'stream'];
    if (supportedUploadObjectTypes.indexOf(key) !== -1) {
      if (supportedUploadObjectTypes.indexOf(payload.type as string) !== -1) {
        form.append(key, payload);
      }
    } else {
      form.append(key, value);
    }
  }

  form.getHeaders = form.getHeaders
    ? form.getHeaders
    : () => {
        return {
          'Content-Type': 'multipart/form-data',
        };
      };

  return form;
}

export function getImgurApiResponseFromResponse(
  response: AxiosResponse | string
): ImgurApiResponse {
  let success = true;
  let data;
  let status = 200;

  if (typeof response === 'string') {
    data = response as string;
    status = 500;
    success = false;
  } else if (
    !!response &&
    typeof response?.data?.status !== 'undefined' &&
    typeof response?.data?.success !== 'undefined'
  ) {
    success = response.data.success;
    status = response.data.status;
    data = response.data.data?.error
      ? response.data.data?.error
      : response.data.data;
  } else {
    status = response ? response.status : status;
    data = response ? response.data : data;
  }

  return {
    data,
    status,
    success,
  };
}
