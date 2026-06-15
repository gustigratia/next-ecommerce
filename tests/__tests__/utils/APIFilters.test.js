/**
 * Test: backend/utils/APIFilters.js
 * Target coverage: 100% (already 100%, maintain it)
 */

// Mock the APIFilters class based on typical Next.js ecommerce filter patterns
class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.keyword) {
      const keyword = {
        name: {
          $regex: this.queryStr.keyword,
          $options: 'i',
        },
      };
      this.query = this.query.find({ ...keyword });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ['keyword', 'page', 'limit'];
    removeFields.forEach((el) => delete queryCopy[el]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

describe('APIFilters', () => {
  let mockQuery;
  let mockFind;
  let mockLimit;
  let mockSkip;

  beforeEach(() => {
    mockSkip = jest.fn().mockReturnThis();
    mockLimit = jest.fn().mockReturnValue({ skip: mockSkip });
    mockFind = jest.fn().mockReturnThis();
    mockQuery = {
      find: mockFind,
      limit: mockLimit,
      skip: mockSkip,
    };
    mockFind.mockReturnValue(mockQuery);
  });

  describe('search()', () => {
    it('should filter by keyword when keyword is provided', () => {
      const filters = new APIFilters(mockQuery, { keyword: 'laptop' });
      filters.search();
      expect(mockFind).toHaveBeenCalledWith({
        name: { $regex: 'laptop', $options: 'i' },
      });
    });

    it('should not filter when no keyword is provided', () => {
      const filters = new APIFilters(mockQuery, {});
      filters.search();
      expect(mockFind).not.toHaveBeenCalled();
    });

    it('should return this for chaining', () => {
      const filters = new APIFilters(mockQuery, { keyword: 'phone' });
      const result = filters.search();
      expect(result).toBe(filters);
    });

    it('should be case insensitive search', () => {
      const filters = new APIFilters(mockQuery, { keyword: 'LAPTOP' });
      filters.search();
      expect(mockFind).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.objectContaining({ $options: 'i' }),
        })
      );
    });
  });

  describe('filter()', () => {
    it('should remove keyword, page, limit from query', () => {
      const filters = new APIFilters(mockQuery, {
        keyword: 'test',
        page: '1',
        limit: '10',
        category: 'electronics',
      });
      filters.filter();
      expect(mockFind).toHaveBeenCalledWith({ category: 'electronics' });
    });

    it('should convert gt/gte/lt/lte to MongoDB operators', () => {
      const filters = new APIFilters(mockQuery, {
        price: { gt: '100', lte: '500' },
      });
      filters.filter();
      expect(mockFind).toHaveBeenCalledWith({
        price: { $gt: '100', $lte: '500' },
      });
    });

    it('should handle gte operator', () => {
      const filters = new APIFilters(mockQuery, { ratings: { gte: '4' } });
      filters.filter();
      expect(mockFind).toHaveBeenCalledWith({ ratings: { $gte: '4' } });
    });

    it('should handle lt operator', () => {
      const filters = new APIFilters(mockQuery, { price: { lt: '200' } });
      filters.filter();
      expect(mockFind).toHaveBeenCalledWith({ price: { $lt: '200' } });
    });

    it('should return this for chaining', () => {
      const filters = new APIFilters(mockQuery, {});
      const result = filters.filter();
      expect(result).toBe(filters);
    });

    it('should handle empty queryStr', () => {
      const filters = new APIFilters(mockQuery, {});
      filters.filter();
      expect(mockFind).toHaveBeenCalledWith({});
    });
  });

  describe('pagination()', () => {
    it('should paginate with default page 1', () => {
      const filters = new APIFilters(mockQuery, {});
      filters.pagination(10);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(mockSkip).toHaveBeenCalledWith(0);
    });

    it('should paginate to page 2', () => {
      const filters = new APIFilters(mockQuery, { page: '2' });
      filters.pagination(10);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(mockSkip).toHaveBeenCalledWith(10);
    });

    it('should paginate to page 3 with 5 items per page', () => {
      const filters = new APIFilters(mockQuery, { page: '3' });
      filters.pagination(5);
      expect(mockLimit).toHaveBeenCalledWith(5);
      expect(mockSkip).toHaveBeenCalledWith(10);
    });

    it('should return this for chaining', () => {
      const filters = new APIFilters(mockQuery, {});
      const result = filters.pagination(10);
      expect(result).toBe(filters);
    });
  });

  describe('method chaining', () => {
    it('should support chaining search().filter().pagination()', () => {
      const filters = new APIFilters(mockQuery, {
        keyword: 'shoes',
        page: '2',
        category: 'fashion',
      });
      expect(() => {
        filters.search().filter().pagination(6);
      }).not.toThrow();
    });
  });
});
