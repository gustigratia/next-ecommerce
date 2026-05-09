/**
 * Single Product Page component fetches and displays details of a specific product and related items.
 * It uses Axios to fetch product data from the API based on the provided product ID.
 * The SingleProductDetail component is used to display the details of the selected product.
 * The SimilarItems component is used to display other products in the same category.
 * @param {Object} params - Route parameters, including 'singleProductId' for the specific product.
 * @returns {JSX.Element} - Rendered component displaying the single product details and similar items.
 */
import axios from "axios";
import SingleProductDetail from "@/app/clientComponent/SingleProductDetail";
import SimilarItems from "@/app/clientComponent/SimilarItems";

const singleProduct = async ({ params }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data } = await axios.get(
    `${baseUrl}/api/product/${params.singleProductId}`
  );

  const productData = await axios.get(`${baseUrl}/api/product`);

  return (
    <div>
      <SingleProductDetail singleProductData={data.singleProductDetail} />
      <SimilarItems
        allProductData={productData.data.products}
        productCateogary={data.singleProductDetail.category}
      />
    </div>
  );
};

export default singleProduct;