const express = require('express');
const members = require('../routes/members');


module.exports = function(app) {
  app.use(express.json());
  app.use('/api/members', members);
require('../routes/images')(app);

}