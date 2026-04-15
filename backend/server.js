require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// connect to DB
connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// In Firebase App Hosting, the backend is served under the /_/backend route prefix.
// In development, routes are mounted at root (/).
const routePrefix = process.env.NODE_ENV === 'production' ? '/_/backend' : '';

// Routes
app.use(`${routePrefix}/api/auth`, require('./routes/authRoutes'));
app.use(`${routePrefix}/api/categories`, require('./routes/categoryRoutes'));
app.use(`${routePrefix}/api/products`, require('./routes/productRoutes'));
app.use(`${routePrefix}/api/orders`, require('./routes/orderRoutes'));
app.use(`${routePrefix}/api/payments`, require('./routes/paymentRoutes'));
app.use(`${routePrefix}/api/upload`, require('./routes/uploadRoutes'));

// Static folder for images
app.use(`${routePrefix}/productimages`, express.static(path.join(__dirname, '../productimages')));

app.get('/', (req, res) => {
  res.send('Zarlo Backend API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
