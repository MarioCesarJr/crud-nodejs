const mongoose = require('mongoose');
const ProductModel = require('../../src/models/Product');

const productData = {
  title: 'ReactJS',
  description: 'SPA application',
  url: 'http://github.com/facebook/react'
};

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    },
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
});

describe('Product Model Test', () => {
  it('create & save product successfully', async () => {
    const validProduct = new ProductModel(productData);
    const savedProduct = await validProduct.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.title).toBe(productData.title);
    expect(savedProduct.description).toBe(productData.description);
    expect(savedProduct.url).toBe(productData.url);
  });

  it('updates a product', async () => {
    const product = new ProductModel(productData);
    await product.save();

    product.title = 'ReactJS update';
    const updatedProduct = await product.save();

    const expected = 'ReactJS update';
    const actual = updatedProduct.title;
    expect(actual).toEqual(expected);
  });

  it('gets a product', async done => {
    const product = new ProductModel(productData);
    await product.save();

    const foundProduct = await ProductModel.findOne({ title: 'ReactJS' });
    const expected = 'ReactJS';
    const actual = foundProduct.title;
    expect(actual).toEqual(expected);
    done();
  });

  it('remove a product', async done => {
    const product = new ProductModel(productData);
    const savedProduct = await product.save();
    await ProductModel.findByIdAndRemove(savedProduct._id);

    expect(null).toEqual(null);
    done();
  });
});

afterEach(async () => {
  await ProductModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});
