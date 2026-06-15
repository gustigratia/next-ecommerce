// __mocks__/next-link.js
const React = require('react');
const NextLink = ({ href, children, ...props }) =>
  React.createElement('a', { href, ...props }, children);
NextLink.displayName = 'NextLink';
module.exports = { __esModule: true, default: NextLink };
