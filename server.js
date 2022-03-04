const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
var cors=require('cors')
app.use(express.json())
app.set('port', 3000)
app.use(cors())
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers","*");
    console.log("request coming from webstore");
    next();
})


const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://afrahmdx:afrah123@coursework2.4wexn.mongodb.net/test', (err, client) => {
    db = client.db('Vue_afterschool_club')
    console.log('Database connected')
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'/static/Coursework1.html'));
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


app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    
    return next()
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

app.get('/collection/:collectionName/search', (req, res, next) => {
    
    var searchQuery = req.query.search;

    req.collection.find({
        $or: [
            { 
                lesson: {
                    $regex: searchQuery, $options: 'i'
                }
            },
            {
                location: {
                    $regex: searchQuery, $options: 'i'
                }
            },
            {
                price: {
                    $regex: searchQuery, $options: 'i'
                }
            },
            {
                spaces: {
                    $regex: searchQuery, $options: 'i'
                }
            }
        ]
    }).toArray((e, results) => {
        if (e) return next(e)
        
        else if (results.length <= 0) {
            return res.send('No results found.')
        }

        return res.send(results)

    })

})

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
    if (e) return next(e)
    
    res.status(200).send("new order added!")
    })
})

app.use(function(req ,res) {
    res.status(404);
    res.send("File not found!");
});

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("Server is listening to port " + port)
});