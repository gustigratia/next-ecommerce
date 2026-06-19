'use client';

import { useEffect, useState } from 'react';

import axios from 'axios';

const ProductReviews = ({ productId, initialReviews = [], initialRating = 0 }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [averageRating, setAverageRating] = useState(initialRating);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    if (!productId) return;

    try {
      setFetchingReviews(true);
      setError('');

      const { data } = await axios.get(`/api/product/${productId}`);

      setReviews(data.singleProductDetail?.reviews || []);
      setAverageRating(data.singleProductDetail?.ratings || 0);
    } catch (err) {
      setError('Gagal mengambil review');
    } finally {
      setFetchingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;

      return (
        <span key={starValue} className={starValue <= value ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Review tidak boleh kosong');
      return;
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      setError('Rating harus antara 1 sampai 5');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await axios.post(`/api/product/${productId}`, {
        name: name.trim() || 'Anonymous',
        rating: Number(rating),
        comment: comment.trim(),
      });

      await fetchReviews();

      setName('');
      setRating(5);
      setHoverRating(0);
      setComment('');
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Gagal menambahkan review'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 border-t pt-6">
      <h2 className="text-2xl font-semibold mb-2">Reviews</h2>

      <div className="mb-4 flex items-center gap-2 text-gray-700">
        <span>Average rating:</span>
        <span className="text-lg">{renderStars(Math.round(averageRating))}</span>
        <strong>{Number(averageRating).toFixed(1)} / 5</strong>
      </div>

      <form onSubmit={handleSubmitReview} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Your name"
          className="w-full rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">Your rating</p>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1;
              const activeRating = hoverRating || rating;

              return (
                <button
                  key={starValue}
                  type="button"
                  aria-label={`${starValue} star`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-3xl transition ${
                    starValue <= activeRating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              );
            })}

            <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
          </div>
        </div>

        <textarea
          placeholder="Write your review"
          className="w-full rounded border px-3 py-2"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <div className="space-y-4">
        {fetchingReviews ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={review._id || index} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{review.name || 'Anonymous'}</h3>

                <div className="flex items-center gap-1 text-lg">
                  {renderStars(Number(review.rating || 0))}
                  <span className="ml-1 text-sm text-gray-600">{review.rating}/5</span>
                </div>
              </div>

              <p className="mt-2 text-gray-700">{review.comment}</p>

              {review.createdAt && (
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(review.createdAt).toISOString().slice(0, 10)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
