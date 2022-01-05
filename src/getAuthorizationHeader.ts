import {
  isAccessToken,
  isRefreshToken,
  isClientId,
  ImgurTokenResponse,
  Credentials,
} from './common/types';
import { ImgurClient } from './client';
import { IMGUR_API_PREFIX, TOKEN_ENDPOINT } from './common/endpoints';

export async function getAuthorizationHeader(
  client: ImgurClient
): Promise<string> {
  if (isAccessToken(client.credentials)) {
    return `Bearer ${client.credentials.accessToken}`;
  }

  const { clientId, clientSecret, refreshToken } = client.credentials;

  if (isRefreshToken(client.credentials)) {
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

    if (response.status === 200 && response.data) {
      const { access_token: accessToken, refresh_token: refreshToken } =
        response.data as ImgurTokenResponse;

      (client.credentials as Credentials).accessToken = accessToken;
      (client.credentials as Credentials).refreshToken = refreshToken;

      return `Bearer ${accessToken}`;
    }
  }

  if (isClientId(client.credentials)) {
    return `Client-ID ${clientId}`;
  }

  return null;
}
