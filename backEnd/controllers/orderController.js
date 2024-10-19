const Order = require("../models/ordersModels");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError")


//create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    })
})


// get Single order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{

const orderDetails = await Order.findById(req.params.id).populate("user","name email");

if(!orderDetails){
return next(new ErrorHandler("Order not found with this Id",400));
}
res.status(200).json({
    success:true,
    orderDetails
})

})


// get logged in user order
exports.myOrders = catchAsyncError(async(req,res,next)=>{

    const orderDetails = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orderDetails
    })
    
    })


    // get all  orders --- admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{

    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
    
    })


        // update  order Status --- admin
exports.updateOrderStatus = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }
if(order.orderStatus === "Delivered"){
    return next(new ErrorHandler("You have already delivered this order",400))
}

 order.orderItems.forEach(async(ord)=>{
    await updateStock(ord.product,ord.quantity)
 })

 order.orderStatus = req.body.status;


 if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
 }

 await order.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
        order,
    })
    
    })

    async function updateStock(id,quantity){
const product = await Product.findById(id);
product.Stock = product.Stock - quantity;
await product.save({validateBeforeSave:false})
    }



       // delete  order --- admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }
 
   await order.deleteOne();
    res.status(200).json({
        success:true,
       
    })
    
    })