import {
  AccessToken,
  isAccessToken,
  isRefreshToken,
  isClientId,
} from './common/types';
import { ImgurClient } from './client';
import { IMGUR_API_PREFIX, TOKEN_ENDPOINT } from './common/endpoints';

export async function getAuthorizationHeader(
  client: ImgurClient
): Promise<string> {
  if (isAccessToken(client.credentials)) {
    return `Bearer ${client.credentials.accessToken}`;
  }

  if (isRefreshToken(client.credentials)) {
    const { clientId, clientSecret, refreshToken } = client.credentials;
    const options: Record<string, unknown> = {
      url: TOKEN_ENDPOINT,
      baseURL: IMGUR_API_PREFIX,
      method: 'POST',
      data: {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      },
    };
    const response = await client.plainRequest(options);
    const authorization: any = response.data;

    if (response.status === 200 && authorization) {
      const { access_token: accessToken, refresh_token: refreshToken } =
        authorization;

      (client.credentials as unknown as AccessToken).accessToken = accessToken;
      (client.credentials as unknown as AccessToken).refreshToken =
        refreshToken;

      return `Bearer ${accessToken}`;
    }
  }

  if (isClientId(client.credentials)) {
    return `Client-ID ${client.credentials.clientId}`;
  }

  return null;
}
