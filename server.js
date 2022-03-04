const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
var cors=require('cors')
app.use(express.json())

app.set('port', 3000)
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers","*");
    console.log("request coming from webstore");
    next();
})
//add static

const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://afrahmdx:afrah123@coursework2.4wexn.mongodb.net/test', (err, client) => {
    db = client.db('Vue_afterschool_club')
})



app.use(function(req, res, next) {
    var filePath = path.join(__dirname, "static", req.url);
    fs.stat(filePath, function(err, fileInfo) {
        if (err) {
            next();
            return;
        }
        
        if (fileInfo.isFile()) {
          res.sendFile(filePath);
        } else {
          next();
        }
    });
});

app.use(function(req ,res) {
    res.status(404);
    res.send("File not found!");
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,static,'./static/Coursework1.html'));
  })

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})


app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
    if (e) return next(e)
    // res.send(results.ops)
    res.status(200).send("new order added!")
    })
})

app.listen(3000);