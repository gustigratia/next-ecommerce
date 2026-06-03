/**
 * ProductList component is responsible for rendering a list of products using the ProductItem component.
 * It receives an array of products as props and maps through each product, rendering a ProductItem component for each.
 * @param {Object} props - Component properties.
 * @param {Object} props.allProductData - Object containing product data, including an array of products to be displayed.
 * @returns {JSX.Element} - Rendered ProductList component.
 */
import ProductItem from './ProductItem';

const ProductList = ({ allProductData }) => {
  return (
    <section className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row -mx-4">
        <main className="w-full px-3">
          {allProductData?.products?.map((product) => (
            <ProductItem key={product?._id} product={product} />
          ))}
        </main>
      </div>
    </section>
  );
};

export default ProductList;
