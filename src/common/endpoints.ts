export const IMGUR_API_PREFIX = 'https://api.imgur.com';

export const API_VERSION = '3';

/// DEPRECATED: this endpoint is only used for 'code' or 'pin' type authentication,
/// which are both deprecated by Imgur (see: )
export const AUTHORIZE_ENDPOINT = 'oauth2/authorize';

export const TOKEN_ENDPOINT = 'oauth2/token';

export const ACCOUNT_ENDPOINT = `${API_VERSION}/account`;

export const ALBUM_ENDPOINT = `${API_VERSION}/album`;

export const IMAGE_ENDPOINT = `${API_VERSION}/image`;

export const UPLOAD_ENDPOINT = `${API_VERSION}/upload`;

export const GALLERY_ENDPOINT = `${API_VERSION}/gallery`;

export const SUBREDDIT_GALLERY_ENDPOINT = `${API_VERSION}/gallery/r`;

export const SEARCH_GALLERY_ENDPOINT = `${API_VERSION}/gallery/search`;
