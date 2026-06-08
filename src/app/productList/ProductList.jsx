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
