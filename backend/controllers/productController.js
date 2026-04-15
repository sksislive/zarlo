const Product = require('../models/Product');

// Get all approved products (Public)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'approved' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products (Admin)
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      name, sellingPrice, discountPrice, description, category, brand,
      stock, sizes, images, status, shippingCharges, taxes
    } = req.body;

    // Calculate total stock if sizes are provided
    const totalStock = sizes && sizes.length > 0
      ? sizes.reduce((acc, curr) => acc + Number(curr.stock), 0)
      : Number(stock);

    const product = new Product({
      seller_id: req.user._id,
      name,
      sellingPrice,
      discountPrice,
      description,
      category,
      brand,
      sizes: sizes || [],
      stock: totalStock,
      images,
      status: status || 'pending',
      shippingCharges: Number(shippingCharges) || 0,
      taxes: Number(taxes) || 0
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product (Admin/Seller)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.sellingPrice = req.body.sellingPrice !== undefined ? req.body.sellingPrice : product.sellingPrice;
      product.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : product.discountPrice;
      product.description = req.body.description || product.description;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;

      if (req.body.sizes) {
        product.sizes = req.body.sizes;
        product.stock = req.body.sizes.reduce((acc, curr) => acc + Number(curr.stock), 0);
      } else if (req.body.stock !== undefined) {
        product.stock = req.body.stock;
      }

      product.images = req.body.images || product.images;
      product.status = req.body.status || product.status;
      product.shippingCharges = req.body.shippingCharges !== undefined ? Number(req.body.shippingCharges) : product.shippingCharges;
      product.taxes = req.body.taxes !== undefined ? Number(req.body.taxes) : product.taxes;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getAdminProducts, getProductById, createProduct, updateProduct, deleteProduct };
