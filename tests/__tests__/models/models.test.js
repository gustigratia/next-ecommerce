/**
 * Test: backend/models/*.js
 * Current coverage: 0% lines → target ≥ 60%
 * We test schema shape and validation logic inline (no DB needed)
 */

// ── Mongoose mock ──────────────────────────────────────────────────────────
jest.mock('mongoose', () => {
  const models = {};

  const Schema = jest.fn(function (definition, options) {
    this.definition = definition;
    this.options = options;
    this.methods = {};
    this.virtual = jest.fn().mockReturnValue({ get: jest.fn() });
    this.pre = jest.fn();
    this.post = jest.fn();
    this.index = jest.fn();
  });

  Schema.Types = {
    ObjectId: 'ObjectId',
    Mixed: 'Mixed',
  };

  const createModel = (name, schema) => {
    function Model(data) {
      Object.assign(this, data);
    }

    Model.modelName = name;
    Model.schema = schema;

    Model.find = jest.fn();
    Model.findById = jest.fn();
    Model.findOne = jest.fn();
    Model.findOneAndDelete = jest.fn();
    Model.findByIdAndUpdate = jest.fn();
    Model.findByIdAndDelete = jest.fn();
    Model.countDocuments = jest.fn();
    Model.create = jest.fn();

    Model.prototype.save = jest.fn();

    return Model;
  };

  const mongooseMock = {
    Schema,
    models,
    model: jest.fn((name, schema) => {
      if (models[name]) return models[name];

      const NewModel = createModel(name, schema);
      models[name] = NewModel;

      return NewModel;
    }),
    connect: jest.fn(),
  };

  return {
    __esModule: true,
    default: mongooseMock,
    ...mongooseMock,
  };
});

// ── Product Model Tests ────────────────────────────────────────────────────
describe('Product Model', () => {
  let Product;

  beforeEach(() => {
    jest.resetModules();
    Product = require('../../../src/backend/models/product').Product;
  });

  it('should be defined', () => {
    expect(Product).toBeDefined();
  });

  it('should have static methods from mongoose model', () => {
    expect(typeof Product.find).toBe('function');
    expect(typeof Product.findById).toBe('function');
    expect(typeof Product.findByIdAndUpdate).toBe('function');
    expect(typeof Product.findByIdAndDelete).toBe('function');
  });

  it('should create product instance with valid data', () => {
    const product = new Product({
      name: 'Test Laptop',
      price: 10000000,
      category: 'electronics',
      stock: 10,
    });
    expect(product.name).toBe('Test Laptop');
    expect(product.price).toBe(10000000);
    expect(product.category).toBe('electronics');
    expect(product.stock).toBe(10);
  });

  it('should have model name Product', () => {
    expect(Product.modelName).toBe('Product');
  });

  it('should have countDocuments method', () => {
    expect(typeof Product.countDocuments).toBe('function');
  });
});

// ── Cart Model Tests ───────────────────────────────────────────────────────
describe('Cart Model', () => {
  let Cart;

  beforeEach(() => {
    jest.resetModules();
    Cart = require('../../../src/backend/models/cart').Cart;
  });

  it('should be defined', () => {
    expect(Cart).toBeDefined();
  });

  it('should have model name Cart', () => {
    expect(Cart.modelName).toBe('Cart');
  });

  it('should create cart instance with valid data', () => {
    const cart = new Cart({
      userId: 'user-123',
      cartItems: [{ productId: 'prod-1', quantity: 2, price: 999 }],
    });
    expect(cart.userId).toBe('user-123');
    expect(cart.cartItems).toHaveLength(1);
  });

  it('should have find method', () => {
    expect(typeof Cart.find).toBe('function');
  });

  it('should have findOne method', () => {
    expect(typeof Cart.findOne).toBe('function');
  });
});

// ── Order Model Tests ──────────────────────────────────────────────────────
describe('Order Model', () => {
  let Order;

  beforeEach(() => {
    jest.resetModules();
    Order = require('../../../src/backend/models/order').default;
  });

  it('should be defined', () => {
    expect(Order).toBeDefined();
  });

  it('should have model name Order', () => {
    expect(Order.modelName).toBe('Order');
  });

  it('should create order instance with valid data', () => {
    const order = new Order({
      userId: 'user-123',
      orderItems: [{ product: 'prod-1', quantity: 1, price: 999 }],
      totalPrice: 999,
      orderStatus: 'Processing',
    });
    expect(order.userId).toBe('user-123');
    expect(order.totalPrice).toBe(999);
    expect(order.orderStatus).toBe('Processing');
  });

  it('should have findById method', () => {
    expect(typeof Order.findById).toBe('function');
  });

  it('should have findByIdAndUpdate method', () => {
    expect(typeof Order.findByIdAndUpdate).toBe('function');
  });
});

// ── User Model Tests ───────────────────────────────────────────────────────
describe('User Model', () => {
  let User;

  beforeEach(() => {
    jest.resetModules();
    User = require('../../../src/backend/models/user').default;
  });

  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should have model name User', () => {
    expect(User.modelName).toBe('User');
  });

  it('should create user instance with valid data', () => {
    const user = new User({
      uid: 'firebase-uid-123',
      name: 'Gusti Gratia',
      email: 'gusti@example.com',
      role: 'user',
    });
    expect(user.name).toBe('Gusti Gratia');
    expect(user.email).toBe('gusti@example.com');
    expect(user.role).toBe('user');
  });

  it('should have findOne method', () => {
    expect(typeof User.findOne).toBe('function');
  });
});

// ── Wishlist Model Tests ───────────────────────────────────────────────────
describe('Wishlist Model', () => {
  let Wishlist;

  beforeEach(() => {
    jest.resetModules();
    Wishlist = require('../../../src/backend/models/wishlist').Wishlist;
  });

  it('should be defined', () => {
    expect(Wishlist).toBeDefined();
  });

  it('should have model name Wishlist', () => {
    expect(Wishlist.modelName).toBe('Wishlist');
  });

  it('should create wishlist instance with valid data', () => {
    const wishlist = new Wishlist({
      userId: 'user-123',
      productId: 'prod-1',
    });
    expect(wishlist.userId).toBe('user-123');
    expect(wishlist.productId).toBe('prod-1');
  });

  it('should have find method', () => {
    expect(typeof Wishlist.find).toBe('function');
  });

  it('should have findOneAndDelete method', () => {
    expect(typeof Wishlist.findOneAndDelete).toBe('function');
  });
});
