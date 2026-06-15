// __mocks__/next-image.js
const React = require('react');
const NextImage = ({ src, alt, width, height, ...props }) =>
  React.createElement('img', { src, alt, width, height, ...props });
NextImage.displayName = 'NextImage';
module.exports = { __esModule: true, default: NextImage };
