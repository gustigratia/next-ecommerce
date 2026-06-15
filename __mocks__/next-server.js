const createJsonResponse = (data, init = {}) => {
  const status = init.status || 200;

  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
  });
};

const NextResponse = {
  json: createJsonResponse,

  redirect: (url, init = {}) => {
    return Response.redirect(url, init.status || 307);
  },

  next: () => {
    return new Response(null, { status: 200 });
  },
};

module.exports = {
  NextResponse,
  NextRequest: Request,
};
