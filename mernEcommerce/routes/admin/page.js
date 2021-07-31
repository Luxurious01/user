/*const express = require('express')
const router  = express.Router()
const Page = require('../../models/page');
const  upload  = require('../../middleware/upload');

router.post('/page/create', upload.fields([
    { name: 'banners'},
    { name: 'products'}
]),(req,res) =>{
    
        
      
    const{banners , products } = req.files;
    if(banners.length > 0){
    req.body.banners   = banners.map((banner , index ) => ({
            img: `http://localhost:5000/public/`,
            navigateTo: `/bannerclicked?categoryId=req.body.category&type=req.body.type`
        }));
    }
    if(products.length > 0){
       req.body.products= products.map((product , index ) => ({
            img: `http://localhost:5000/public/${products.filename}`,
            navigateTo: `/productclicked?categoryId=req.body.category&type=req.body.type`
        }));
    }

     //req.body.createdBy = req.user._id;

     const page = new Page(req.body);
     page.save((error,page) => {
         if(error) return res.status(400).json({ error });
         if(page){
             return res.status(201).json({ page });
         }
     })


    res.status(200).json({ body: req.body });
})


module.exports = router */