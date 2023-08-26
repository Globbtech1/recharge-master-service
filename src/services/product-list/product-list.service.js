// Initializes the `productList` service on path `/product-list`
const { ProductList } = require('./product-list.class');
const createModel = require('../../models/product-list.model');
const hooks = require('./product-list.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/product-list', new ProductList(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('product-list');

  service.hooks(hooks);
};
