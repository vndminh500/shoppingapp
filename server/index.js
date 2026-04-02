const express = require('express');
require('./utils/MongooseUtil');
const app = express();
const PORT = process.env.PORT || 4000;


const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Root: luôn phục vụ trang customer (SPA)
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));
const path = require('path');
// '/admin' serve the files at client-admin/build/* as static files
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));

// SPA fallback for admin: if static file not found, always return index.html
app.use('/admin', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../client-admin/build', 'index.html'),
  );
});
// '/' serve the files at client-customer/build/* as static files
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));

// SPA fallback for customer: if static file not found, always return index.html
app.use('/', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../client-customer/build', 'index.html'),
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;
