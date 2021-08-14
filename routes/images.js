const express = require("express");


//app.use(express.static('public'));  
//app.use('/images', express.static('images')); 

const path = require('path')
const imagesDirectory = '/Users/Backend/node/projects/experiments'
const imageFolder = '1'


module.exports = function(app) {
    app.use('/images', express.static(path.join(imagesDirectory, imageFolder)))
  }