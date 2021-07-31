const express = require('express')
const router  = express.Router()
const Category = require('../../models/category');
const Product = require('../../models/product');
//const mongoose = require('mongoose')
//const User = mongoose.model("User")


function createCategories(categories, parentId=null){

    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined);
    }else{
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
           
            children: createCategories(categories, cate._id)
        });
    }
    return categoryList;
};




router.post('/initialdata', async (req,res) => {
    const categories = await Category.find({}).exec();
    const products = await Product.find({})
         .select('_id name price quantity slug description productionPictures category')
         //.populate( 'category' )
        .exec();
         res.status(200).json({
             categories: createCategories(categories),
             products
         })
})





module.exports = router







    

