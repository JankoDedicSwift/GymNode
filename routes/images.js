const express = require("express");
const winston = require("winston");

//app.use(express.static('public'));  
//app.use('/images', express.static('images')); 

const path = require('path')
//const imagesDirectory = '/Users/Backend/node/projects/1/mongoose'
//const imagesDirectory = './'
const imageFolder = 'uploads'
const imagesDirectory = __dirname;
winston.info(`Dirname is ${__dirname}...`)

module.exports = function(app) {
    app.use('/images', express.static(path.join(imagesDirectory,'..', imageFolder)))
  }