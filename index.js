
const express=require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const bodyParser=require('body-parser');
const uri = "mongodb+srv://binodon:01743484690@cluster0.gwbgzvj.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html') ;
})

app.listen(3000,()=>{
    console.log("listen to port 3000");
})

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

async function insertData() {
 
  
    try {
      const result = await client.db("organicdb").collection("products");

      app.get("/products",async(req,res)=>{
        const documents= await result.find({}).toArray();
            res.send(documents);
        })

      app.post("/addProducts",(req,res)=>{
        const product=req.body;
        result.insertOne(product);
        console.log(product);
        res.redirect('/');
      })
      //console.log("Data inserted:", result.insertedId);

      app.delete('/delete/:id', async (req, res) => {
        const itemId = req.params.id;
      
        try {
          const deleteResult = await result.deleteOne({ _id: new ObjectId(itemId) });
          if (deleteResult.deletedCount === 1) {
            console.log("Document deleted successfully");
            res.send(deleteResult.deletedCount>0);
          } else {
            console.log("Document not found");
            res.status(404).send("Document not found");
          }
        } catch (error) {
          console.error("Error deleting document:", error);
          res.status(500).send("Error deleting document");
        }
      });

      app.get('/product/:id', async(req, res) => {
        const documents= await result.find({_id: new ObjectId(req.params.id)}).toArray();
        res.send(documents);
        console.log(documents)

      });
      app.patch('/update/:id', async(req,res)=>{
        const upResult=await result.updateOne({_id: new ObjectId(req.params.id)},
        {
        $set: {price:req.body.price, quantity:req.body.quantity}
        })
        res.send(upResult.modifiedCount>0);
      })


    } catch (error) {
      console.error("Error inserting data:", error);
    }
    
  }
  
  insertData().catch(console.dir);
  
