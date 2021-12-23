import { Handler } from './';

const BadReqestErrorResponse = {
  status: 400,
  success: false,
  data: {
    error: 'Bad Reqest',
    reqest: '/3/upload',
    method: 'POST',
  },
};

type CreateResponseOptions = {
  id?: string;
  type?: string | null;
  title?: string | null;
  description?: string | null;
};

function createResponse({
  id = 'JK9ybyj',
  type = null,
  title = null,
  description = null,
}: CreateResponseOptions) {
  return {
    data: {
      id,
      deletehash: Array.from(id).reverse().join(''),
      title,
      description,
      link: `https://i.imgur.com/${id}.${type === 'video' ? 'mp4' : 'jpg'}`,
    },
    success: true,
    status: 200,
  };
}

export const postHandler: Handler = (req, res, ctx) => {
  const formData = req.body as FormData;
  const image = formData.get('image')?.valueOf();
  const stream = formData.get('stream')?.valueOf();
  const base64 = formData.get('base64')?.valueOf();
  const type = formData.get('type')?.valueOf() as string;
  const title = formData.get('title')?.valueOf() as string;
  const description = formData.get('description')?.valueOf() as string;

  if (image === null && stream === null && base64 === null) {
    return res(ctx.status(400), ctx.json(BadReqestErrorResponse));
  }

  // type is optional when uploading a file, but reqired
  // for any other type
  if (type !== null) {
    // only these types are allowed
    if (!['stream', 'url', 'base64'].includes(type as string)) {
      return res(ctx.status(400), ctx.json(BadReqestErrorResponse));
    }
    // if type is not specified we assume we're uploading a file.
    // but we need to make sure a file was sent in the image field
  }
  // else if (typeof image !== 'object') {
  //   return res(ctx.status(400), ctx.json(BadReqestErrorResponse));
  // }

  return res(ctx.json(createResponse({ title, description })));
};
