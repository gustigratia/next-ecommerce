import Image from 'next/image';
import Link from 'next/link';

import HeroAnimation from '../app/components/hero/HeroAnimation';

export const dynamic = 'force-dynamic';

const staticLinkData = [
  {
    id: 1,
    imgUrl:
      'https://images.pexels.com/photos/1432794/pexels-photo-1432794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nameLink: 'Electronics',
  },
  {
    id: 2,
    imgUrl:
      'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nameLink: 'Laptops',
  },
  {
    id: 3,
    imgUrl:
      'https://res.cloudinary.com/ecom-next/image/upload/v1698414767/products/z1orehzonbyyk5dngb4h.jpg',
    nameLink: 'Cameras',
  },
  {
    id: 4,
    imgUrl:
      'https://images.pexels.com/photos/157888/fashion-glasses-go-pro-female-157888.jpeg?auto=compress&cs=tinysrgb&w=800',
    nameLink: 'Accessories',
  },
  {
    id: 5,
    imgUrl:
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    nameLink: 'Headphones',
  },
  {
    id: 6,
    imgUrl:
      'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800',
    nameLink: 'Sports',
  },
];

export default function Home() {
  return (
    <section className="text-gray-600 w-full md:w-11/12 px-4 mx-auto">
      <div className="mx-auto flex py-4 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center relative py-10">
          <span className="block font-bold text-xl md:text-2xl px-4 rounded-xl running-text">
            Ecommerce website for ShowCase
          </span>
          <h1 className="title-font text-3xl md:text-4xl mb-4 font-medium text-gray-900">
            I Work. You will Grow.
          </h1>
          <p className="mb-8 leading-relaxed text-justify font-sans font-semibold text-slate-400">
            I am dedicated for professionals works, including skilled developers, creative
            designers, customer-focused experts, technology enthusiasts, and operations specialists.
            Our unwavering mission is to collaboratively assist our clients and partners in bringing
            their innovative ideas to life.
            <br />
            From web and mobile application development to cutting-edge design, we cater to your
            diverse needs. As technology enthusiasts and problem-solvers, we handle every aspect of
            your project, from conception to execution.
          </p>
          <div className="flex justify-center">
            <Link
              href="/productList"
              className="inline-flex text-white bg-red-800 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg"
            >
              Let's Go To Ecommerce
            </Link>
          </div>
        </div>
        <div className="lg:max-w-xl lg:w-full md:w-1/2 w-5/6">
          <HeroAnimation />
        </div>
      </div>

      <div className="container py-9">
        <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
          <div className="border border-gray-300 rounded-sm p-6 flex justify-center items-center flex-col">
            <i className="fas fa-truck text-3xl text-primary mb-4"></i>
            <div>
              <h4 className="font-medium capitalize text-lg">Free Shipping</h4>
              <p className="text-gray-500 text-sm">On Orders Over ₹2000</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-sm p-6 flex justify-center items-center flex-col">
            <i className="fas fa-money-check-dollar text-3xl text-primary mb-4"></i>
            <div>
              <h4 className="font-medium capitalize text-lg">Money Returns</h4>
              <p className="text-gray-500 text-sm">30 Days Money Returns</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-sm p-6 flex justify-center items-center flex-col">
            <i className="fas fa-phone text-3xl text-primary mb-4"></i>
            <div>
              <h4 className="font-medium capitalize text-lg">24/7 Support</h4>
              <p className="text-gray-500 text-sm">Dedicated Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">shop by category</h2>
        <div className="grid grid-cols-3 gap-3">
          {staticLinkData.map((item) => (
            <div key={item.id} className="relative rounded-sm overflow-hidden group">
              <img src={item.imgUrl} alt="category 1" className="w-full h-full" />
              <Link
                href={`/productList?category=${encodeURIComponent(item.nameLink)}`}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-white font-roboto font-extrabold group-hover:bg-opacity-60 transition"
              >
                {item.nameLink}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
