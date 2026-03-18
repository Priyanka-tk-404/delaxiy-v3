const express = require('express');
const Order   = require('../models/Order');
const router  = express.Router();

router.get('/', async (req,res) => {
  try { res.json(await Order.find({user:req.user._id}).sort({createdAt:-1})); }
  catch(e){ res.status(500).json({message:e.message}); }
});

router.post('/', async (req,res) => {
  try {
    const order = new Order({...req.body, user:req.user._id});
    await order.save();
    res.status(201).json(order);
  } catch(e){ res.status(400).json({message:e.message}); }
});

router.put('/:id', async (req,res) => {
  try {
    const order = await Order.findOne({_id:req.params.id, user:req.user._id});
    if (!order) return res.status(404).json({message:'Not found'});
    Object.assign(order, req.body);
    order.totalAmount = order.quantity * order.unitPrice;
    await order.save();
    res.json(order);
  } catch(e){ res.status(400).json({message:e.message}); }
});

router.delete('/:id', async (req,res) => {
  try {
    await Order.findOneAndDelete({_id:req.params.id, user:req.user._id});
    res.json({success:true});
  } catch(e){ res.status(500).json({message:e.message}); }
});

module.exports = router;
