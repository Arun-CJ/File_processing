const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const uploadPath = './uploads'
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})
var upload = multer({ storage: storage })

router.post('/', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    fs.readFile(`./uploads/${file.filename}`, 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: ' + file.filename);
        let result = [];
        let results = null;
        let rows = data.split("\r\n");
        if(rows[0].toString().includes(',')){
          rows.map(async item => {
            (function (item) {
              let currentline = item.split(',');
              currentline = currentline.slice(0,4)
              result.push(currentline);
            }(item))
          })
          results = {
            data : result,
            delimiter : "true",
            lines : 2
          }
          res.send(results)
        }else{
          results = {
            data : rows,
            delimiter : "false",
            lines : 2
          }
          res.send(results)
        }
        console.log(results)
      })
  })

router.post('/delimiter', (req, res, next) => {
  fs.readFile(`./uploads/${req.body.fname}`, 'utf8', function(err, data) {
      if (err) throw err;
      // console.log('OK: ' + file.filename);
      let result = [];
      let results = null;
      let delimiterlength = ''
      let rows = data.split("\r\n");
      rows.map(item => {
        let currentline = item.split(`${req.body.delimiter}`);
        if(currentline.length > 1) {
          delimiterlength = "true"
        }
        else {
          delimiterlength = "false"
        }
        currentline = currentline.slice(0,4)
        result.push(currentline);
      })
      results = {
        data : result,
        delimiter : delimiterlength,
        lines : req.body.lines
      }
      res.send(results)
    })
})

module.exports = router;