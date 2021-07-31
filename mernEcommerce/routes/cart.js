const express = require('express');

const slugify = require('slugify');
const requireLogin = require('../middleware/requireLogin');
const userMiddler = require('../middleware/userMiddler');
const Cart = require('../models/cart');
const router = express.Router();


router.post('/cart/addtocart',requireLogin,userMiddler,(req,res) => {

        Cart.findOne({user: req.user._id})
        .exec((error, cart) => {
            if(error) return res.status(400).json({error});
            if(cart){
            
            const product = req.body.cartItems.product
            const  item = cart.cartItems.find(c => c.product == product);
            let condition, update;
              
                 if(item){
                     condition = { "user": req.user._id, "cartItems.product": product}
                     update = {
                         "$set" : {
                             "cartItems.$": {
                                 ...req.body.cartItem,
                                 quantity: item.quantity + req.body.cartItems.quantity
                        }
                    }
                };

                  

                 }else{
                     condition = { user: req.user._id};
                     update ={
                      "$push" : {
                        "cartItems": req.body.cartItem
                    }
                };


               
            }
             Cart.findOneAndUpdate(condition, update)
           .exec((error, _cart) => {
               if(error) return res.status(400).json({ error });
               if(_cart){
                   return res.status(201).json({ cart: _cart });
               }
           })

               // res.status(200).json({message: cart});

            } else{
                const cart = new Cart({
                    user: req.user._id,
                    cartItems: [req.body.cartItems]
                });
                cart.save((error, cart) =>{
                    if(error) return res.status(400).json({error});
                    if(cart){
                        return res.status(201).json({ cart });
                    }
        
                })

            }
        });

        
    
    });



    module.exports = router;