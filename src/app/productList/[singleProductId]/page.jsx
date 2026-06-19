import axios from 'axios';

import ProductReviews from '@/app/clientComponent/ProductReviews';
import SimilarItems from '@/app/clientComponent/SimilarItems';
import SingleProductDetail from '@/app/clientComponent/SingleProductDetail';

export const dynamic = 'force-dynamic';

const SingleProduct = async ({ params }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data } = await axios.get(`${baseUrl}/api/product/${params.singleProductId}`);
  const productData = await axios.get(`${baseUrl}/api/product`);

  const product = data.singleProductDetail;

  return (
    <div>
      <SingleProductDetail singleProductData={product} />

      <ProductReviews
        productId={product._id}
        initialReviews={product.reviews || []}
        initialRating={product.ratings || 0}
      />

      <SimilarItems
        allProductData={productData.data.products}
        productCateogary={product.category}
      />
    </div>
  );
};

export default SingleProduct;
