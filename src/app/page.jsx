import dynamic from 'next/dynamic';
import Link from 'next/link';

import PromoModal from '../app/components/PromoModal';

const HeroAnimation = dynamic(() => import('@/app/components/hero/HeroAnimation'), { ssr: false });

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

const featureData = [
  {
    icon: 'fas fa-truck',
    title: 'Pengiriman Gratis',
    description: 'Untuk pembelian di atas £200',
  },
  {
    icon: 'fas fa-money-check-dollar',
    title: 'Garansi Uang Kembali',
    description: 'Kembalikan dalam 30 hari tanpa pertanyaan',
  },
  {
    icon: 'fas fa-headset',
    title: 'Dukungan 24/7',
    description: 'Tim pelanggan siap membantu setiap saat',
  },
];

export default function Home() {
  return (
    <section className="w-full text-gray-700">
      <PromoModal />
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:py-10">
        <div className="relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-br from-white via-red-50 to-white shadow-sm">
          <div className="absolute left-0 top-0 h-3 w-full bg-red-600" />
          <div className="grid items-center gap-8 px-5 py-10 md:grid-cols-2 md:px-10 lg:px-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-red-700">
                <i className="fas fa-flag" />
                Promo Kemerdekaan
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-950 md:text-5xl">
                Merdeka Berbelanja, Merdeka Hemat
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
                Temukan produk elektronik, kamera, laptop, aksesori, dan kebutuhan harian dengan
                suasana merah putih yang rapi, cepat, dan mudah dipakai.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/productList"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95"
                >
                  <i className="fas fa-shopping-bag" />
                  Mulai Berbelanja
                </Link>
                <Link
                  href="/wishlist"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-6 py-3 font-bold text-red-700 shadow-sm transition hover:bg-red-50 active:scale-95"
                >
                  <i className="fas fa-heart" />
                  Lihat Wishlist
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <HeroAnimation />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {featureData.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-xl text-red-600">
                <i className={item.icon}></i>
              </span>
              <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-red-600">
                Kategori Pilihan
              </p>
              <h2 className="text-3xl font-extrabold text-gray-950">
                Belanja berdasarkan kebutuhan
              </h2>
            </div>
            <p className="max-w-lg text-sm text-gray-600">
              Pilih kategori favorit dan temukan produk terbaik untuk melengkapi momen Kemerdekaan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {staticLinkData.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-red-50 shadow-sm"
              >
                <img
                  src={item.imgUrl}
                  alt={item.nameLink}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <Link
                  href={`/productList?category=${encodeURIComponent(item.nameLink)}`}
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-red-950/75 via-red-700/20 to-transparent p-5 text-2xl font-extrabold text-white transition group-hover:from-red-950/85"
                >
                  {item.nameLink}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
