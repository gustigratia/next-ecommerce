const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream, TransformStream } = require('stream/web');
const { Blob, File } = require('buffer');
const { MessageChannel, MessagePort } = require('worker_threads');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.Blob = Blob;
global.File = File;
global.MessageChannel = MessageChannel;
global.MessagePort = MessagePort;

const { fetch, Request, Response, Headers, FormData } = require('undici');

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.FormData = FormData;

if (typeof Response.json !== 'function') {
  Response.json = function json(data, init = {}) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init.headers || {}),
      },
    });
  };
}
