const port = 5000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const { type } = require("os");


app.use(express.json());
app.use(cors());

//Database connection with MongoDB
mongoose.connect("mongodb+srv://geethmianjani02:gimmi1234@cluster0.rl4ug.mongodb.net/ECOMMERCE")
 
//API creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//Image stirage engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`

    })
})
//Shema for creating products

// Schema for creating products
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {  
        type: Boolean,
        default: true,
    },
});

// Register the model correctly
const Product = mongoose.model("Product", productSchema);

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

app.post('/removeproduct', async (req, res) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findOneAndDelete({ id: productId });
        if (product) {
            res.json({ success: true, message: 'Product removed successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});




//creating API for getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("Fetched Products:", products); // Debugging step
        res.send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ message: "Server error" });
    }
});


//Shema creating for User model

const users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating Endpoint for registering the user
app.post('/signup',async(req,res)=>{
    let check = await users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})

    }
    let cart={};
    for(let i =0; i<300; i++){
        cart[i]=0;
    }
    const user = new users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data ={
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//Creating endpoint for user login
app.post('/login',async(req,res)=>{
    let user = await users.findOne({email:req.body.email})
    if (user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data ={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            req.json({success:false,errors:"wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"wrong email id"});
    }
})

//creating endpoint for newCollection
app.get('/newcollection',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.send(newcollection);

})

//Creating endpoint for popular in women category
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let populat_in_women = products.slice(0,4);
    console.log("Popular in women  Fetched");
    res.send(populat_in_women);

})

//Creating middlware to fetch user
 const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"please authenticate using valid token"})

    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();

        }catch(error){
            res.status(401).send({errors:"please authenticate using valid token"})

        }
    }
 }

//creating endpoint for adding product in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    
    let userData = await users.findOne({_id:req.user.id})
    console.log("added",req.body.itemId);
    userData.cartData[req.body.itemId] +=1;
    await users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})

// creating endpoint to remove products from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    
    let userData = await users.findOne({_id:req.user.id})
    console.log("removed",req.body.itemId);
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})

//Creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log('GetCart');
    let userData = await users.findOne({_id:req.user.id});
    res.json(userData.cartData);

})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server is Running on port "+port)
    }else{
        console.log("Error : "+error)
    }
})