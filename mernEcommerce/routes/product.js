const express = require('express');
const Product = require('../models/product');
const slugify = require('slugify');
const Category = require('../models/category');
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const adminMiddler = require('../middleware/adminMiddler');
const requireLogin = require('../middleware/requireLogin');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(path.dirname( __dirname) , 'upload'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage});




router.post('/product/create',requireLogin,adminMiddler,upload.array('productPicture') , (req,res) => {
   // res.status(200).json({ file: req.files, body: req.body}); 
      const {
          name , price , description , category ,quantity , createdBy
      } = req.body;
      let productPictures = [];
   


      if(req.files.length > 0){
          productPictures = req.files.map(file => {
              return {img: file.filename }

          })

      }



      const product = new Product({
           name:name,
           slug: slugify(name),
           price,
           quantity ,
           description,
           productPictures,
           category,
           createdBy: req.user._id
      });

      product.save((error , product) => {
        if(error) return res.status(400).json({error});
        if(product){
            res.status(201).json({product});
          }
      })
   
}); 

    router.get('/products/:slug',  (req,res) => {
      const { slug } = req.params;
       Category.findOne({ slug: slug })
      .select('_id')
      .exec((error,category) =>{
        if(error){
          return res.status(400).json({ error });
        }

        if(category){
          Product.find({ category: category._id })
          .exec((error , products) => {
            res.status(200).json({
              products,
              productsByPrice:{
               under300: products.filter(product => product.price <= 300),
               under700: products.filter(product => product.price > 300  && product.price <= 700),
              }
            
            
            });
          })

        }
       
        res.status(200).json({category});


       
      }); 

      
    })







module.exports = router;
