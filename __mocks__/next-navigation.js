// __mocks__/next-navigation.js
const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
}));

const usePathname = jest.fn(() => '/');
const useParams = jest.fn(() => ({}));
const useSearchParams = jest.fn(() => new URLSearchParams());
const redirect = jest.fn();
const notFound = jest.fn();

module.exports = {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
  redirect,
  notFound,
};
