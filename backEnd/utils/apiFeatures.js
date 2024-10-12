class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    // Search Feature
    search(){
        const keyword = this.queryStr.keyword ?{
            name:{
                $regex:this.queryStr.keyword,
                $options : "i"  , // case sensitive
            }
        } : {};
        this.query = this.query.find({...keyword})
        return this;
    }

    // filter Feature
    filter(){
     const queryCopy = {...this.queryStr}   //  <=== original object me change na ho 
     // remove some fields for category
     const removeFields = ["keyword","page","limit"]
      removeFields.forEach(key=> delete queryCopy[key]);
 
      // filter for price and rating
      let  queryStrParams = JSON.stringify(queryCopy)    // convert object to  string
      queryStrParams = queryStrParams.replace(/\b(gt|gte|lt|lte)\b/g,repl => `$${repl}`)     // replace from regular expression

       this.query = this.query.find(JSON.parse(queryStrParams))    // convert  string to  object 
        return this;
    }

    // Pagination
    pagination(resultPerPage){
       const currentPage = Number(this.queryStr.page) || 1;  // total 50 products 1page show 1-10 products  --- 2 page  11-20
       const skip = resultPerPage * (currentPage-1)   //  <<----  starting product like 5  skip shoe 6 to 10
       this.query = this.query.limit(resultPerPage).skip(skip)   
       return this;
    }
} 

module.exports = ApiFeatures