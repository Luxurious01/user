const express = require('express');
const Category = require('../models/category');
const slugify = require('slugify');
const requireLogin = require('../middleware/requireLogin');
const adminMiddler = require('../middleware/adminMiddler');
const router = express.Router();

function createCategories(categories , parentId=null){

    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined);
    } else{
        category = categories.filter(cat => cat.parentId == parentId);
    }
    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            childern: createCategories(categories, cate._id)
        });
    }
    return categoryList;
};


router.post('/category/create',requireLogin,adminMiddler,(req,res) => {
    const categoryObj = {
        name: req.body.name,
        slug:slugify(req.body.name)
    }
    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId;
    }


    const cat = new Category(categoryObj);
    cat.save((error,category) =>{
        if(error) return res.status(400).json({error});
        if(category){
            return res.status(201).json({ category });
        }
    });
});

router.get('/category/get' ,(req,res) => {
    Category.find({})
    .exec((error,categories) =>{
        if(error) return res.status(400).json({ error });

        if(categories){
            const categoryList = createCategories(categories);
            res.status(200).json({categoryList});
        }
    });
});

router.post('/category/update', async (req,res) => {

     const { _id , name , parentId, type} = req.body;
     const updatedCategories = [];
     if(name instanceof Array){

        for(let i=0; i<name.length; i++){
            const category = {
                name: name[i],
                type: type[i]

            }
            if(parentId[i] !== ""){
                category.parentId = parentId[i];

            }

           const updatedCategory = await Category.findOneAndUpdate({_id},category,{new:true})
           updatedCategories.push( updatedCategory);
           
         }
         return res.status(201).json({ updatedCategories });


     }else{
         const category = {
           name,
           type
         };
         if(parentId != ""){
             category.parentId = parentId;
         } 
         const updatedCategory = await Category.findOneAndUpdate({_id},category,{new:true})
         return res.status(201).json({ updatedCategory });
     }


    

})


router.post('/category/delete', async  (req,res) => {
    const { ids } = req.body.payload;
    const deletedCategories = [];
    for(let i=0; i<ids.length; i++ ){
        const deleteCategory = await Category.findOneAndDelete({_id: ids[i]._id });
        deletedCategories.push(deleteCategory);
    }
    if(deletedCategories.length == ids.length){
        res.status(200).json({message: 'categories removed'})
    } else{
        res.status(400).json({message: 'something went wrong'});
    }
    
})






module.exports = router;
