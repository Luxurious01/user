const Order = require("../../models/order");
const express = require('express')
const router  = express.Router()
const requireLogin = require('../../middleware/requireLogin');
const adminMiddler = require('../../middleware/adminMiddler');


router.post( '/updateOrder',requireLogin,adminMiddler,(req, res) => {
  Order.updateOne(
    { _id: req.body.orderId, "orderStatus.type": req.body.type },
    {
      $set: {
        "orderStatus.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(201).json({ order });
    }
  });
});


module.exports = router

