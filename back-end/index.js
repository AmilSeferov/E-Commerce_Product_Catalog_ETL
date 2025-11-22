const express= require('express');
const cors= require('cors')
const app=express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const connection = require('./db');
  app.get('/products',(req,res)=>{
    connection.query('SELECT * FROM products',(err,data)=>{
      if(!err){
        res.status(200).json(data)
      }else{
        res.status(404).json('error')
        console.log('erorr')
      }
    })
  })
  app.listen(2000, (err) => {
    if (!err) {
        console.log('Server is going on')
    }
})