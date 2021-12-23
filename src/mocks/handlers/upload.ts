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
  const _image = formData.get('image');
  const _stream = formData.get('stream');
  const _base64 = formData.get('base64');
  const _type = formData.get('type');
  const _title = formData.get('title');
  const _description = formData.get('description');
  const image = _image ? _image.valueOf() : null;
  const stream = _stream ? _stream.valueOf() : null;
  const base64 = _base64 ? _base64.valueOf() : null;
  const type = _type ? _type.valueOf() : null;
  const title = _title ? _title.valueOf() : null;
  const description = _description ? _description.valueOf() : null;

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

  return res(
    ctx.json(
      createResponse({
        title: title as string,
        description: description as string,
      })
    )
  );
};
