const express = require('express');
const cors =require('cors');
require('./Database/config');
const User = require('./Database/users');
const Product = require('./Database/Product');


const app = express();

app.use(express.json());
app.use(cors());

app.post('/register',async(req,response)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    response.send(result);
});

app.post('/login', async(req,resp)=>{
    console.log(req.body)
    if(req.body.password && req.body.email)
        {
            let user = await User.findOne(req.body).select('-password');
            if(user)
                {
                    resp.send(user)
                }
            else
            {
                resp.send({result: "No user Found"})
            }
    }else{
        resp.send({result: "No user Found"})
    }

})

app.post('/add-product', async(req,resp)=>{
    let product = new Product(req.body);
    let result = await product.save();

    // console.log("\n\nProduct {} result {}\n\n",product,result);
    resp.send({...{status:"success"},...result._doc});
});

app.get("/products", async (req,resp)=>{
    let products = await Product.find();
    if(products.lenght>0){
            resp.send(products)
        }
    
    else{
            resp.send("No results found")
        }
});

app.listen(4000);