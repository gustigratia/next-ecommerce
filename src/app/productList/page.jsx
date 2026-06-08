import { Suspense } from 'react';

import ProductListPage from './ProductListPage';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductListPage />
    </Suspense>
  );
};

export default Page;
