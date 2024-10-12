const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');

//Create Product   ---- Admin
exports.createProduct = catchAsyncError(async(req,res,next)=>{
  req.body.user = req.user.id;
const product = await Product.create(req.body);
res.status(201).json({success:true,product})
});

// Get All Products
exports.getAllProducts = catchAsyncError(async (req,res)=>{
  const resultPerPage = 5;
const  totalProducts = await Product.countDocuments();
// show 1 to 5 page currently
const currentPage = Number(req.query?.page) || 1 ;
const  currentPageShow =   resultPerPage * (currentPage+1);
let startEndProduct = `${currentPageShow}-${totalProducts}`

 const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const products = await apiFeatures.query;     // Product.find();
res.status(200).json({success:true,products,totalProducts,startEndProduct})});

// Get Product details
exports.getProductDetails = catchAsyncError(async (req,res,next) =>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404))
      }
     res.status(200).json({
      success:true,
     product
     })
});

// update Product  --- admin
exports.updateProduct = catchAsyncError(async (req,res,next)=>{
    let product = await Product.findById(req.params.id)
  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }
  product = await Product.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
});
res.status(200).json({
    success:true,
    product
})
})

// delete product   -- admin
exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler("Product not found",404))
    }
   await product.deleteOne();
   res.status(200).json({
    success:true,
    message: "Product Delete Successfully"
   })
    
})


// Create New Review or Update the Review
exports.createProductReview = catchAsyncError(async(req,res,next)=>{
const {rating,comment,productId} = req.body;
  const review = {
    user: req.user._id,
    name:req.user.name,
    rating:Number(rating),
   comment,
  }
const product = await Product.findById(productId);

const isReviewed = product.reviews.find(arr=>arr.user.toString() === req.user._id.toString())

if(isReviewed){
product.reviews.forEach(rev => {
  if(rev.user.toString() === req.user._id.toString()){
    (rev.rating = rating),
    (rev.comment = comment);
  };
});
}else{
  product.reviews.push(review);
  product.numberOfReviews = product.reviews.length
}
// average Rating
let avg = 0;
 product.reviews.forEach(rev=>{
  avg+=rev.rating
}) 

product.ratings = avg / product.reviews.length;

await product.save({validateBeforeSave:false});
res.status(200).json({
  success:true,
})
})

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async(req,res,next)=>{

const product = await Product.findById(req.query.id);
if(!product){
  return next(new ErrorHandler("Product not found",404))
}
res.status(200).json({
  success:true,
  reviews:product.reviews
})

})


// Delete Reviews
exports.deleteReviews = catchAsyncError(async(req,res,next)=>{

  const product = await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }

  const review =product.reviews.filter(rev=>rev._id.toString() !== req.query.id.toString())

// average Rating
let avg = 0;
review.forEach(rev=>{
  avg+=rev.rating
}) 

const ratings = avg / review.length;

const numOfReviews = review.length;
await Product.findByIdAndUpdate(req.query.productId,
  {review,ratings,numOfReviews},
{
  new:true,
  runValidators:true,
  useFindAndModify:false,
})

  res.status(200).json({
    success:true,
  })
  
  })
