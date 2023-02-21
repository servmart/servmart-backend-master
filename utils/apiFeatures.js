class APIFeatures {
    // called as soon any new object of this class is created. 
    //query - mongoose query, 
    //queryString - coming from route (coming from express - req.query)
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    
    filter() {
        const queryObj = {...this.queryString};// hard copy is needed here so destructing it
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        
        //ADV FILTER
        let queryStr = JSON.stringify(queryObj);// convert to string and replace operators with $
        queryStr = queryStr.replace(/\b(gte | gt | lte | lt)\b/g, match => `$$(match)`); // add $ before these 4 operators
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(" ");
            this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(" ");
            this.query = this.query.select(fields);
        } else{
            this.query = this.query.select('-__v');
        }
        
        return this;
    }

    paginate() {
        const pageNumber = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skipVal = (pageNumber - 1) * limit;
        
        //page=2&limit=10
        this.query = this.query.skip(skipVal).limit(limit);

        return this;
    } 
}

module.exports = APIFeatures;