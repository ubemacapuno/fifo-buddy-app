const express = require('express')
const app = express()
const PORT = 8500;
const mongoose = require('mongoose');
//Use env to add protection to the Mongo connection string: 
require('dotenv').config()
//add model variable "TodoTask" that was declared in todotask.js
const FifoItem = require('./models/fifoitem.js')

//Declare middlewares (move traffic to and from front-end to endpoints)
app.set("view engine","ejs") //using ejs for our view engine. Must make a views folder for this!
app.use(express.static('public')) //Express will refer to the public folder. Stylesheet goes in public. Also index.html if using html, but we're doing EJS, which will be in models folder
app.use(express.urlencoded({extended: true})) //helps validate info we are moving back-forth. Extended allows us to pass complex data such as arrays and objects

//tell mongoose to pull data from the env file
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log("Connected to Mongo Database @ \"FifoBuddyItems\"!")}
 )

  //GET-request method to render the page (route '/'):
app.get('/', async (req, res) => {
    try {
        //render and grab the tasks:
        //with empty {}, it grabs everything out of todotask:
        FifoItem.find({}, (err,items) => {
            //Render and FIND list in the database:
            res.render('index.ejs', {
                fifoBuddyItems: items
            })
        })  
    } catch (error) {
        if (err) return res.status(500).send(err)        
    }
})

//POST-request method for post-requests:
app.post('/', async (req,res) => {
    const fifoItem = new FifoItem(
        {
            item: req.body.item,
            expirationDate: req.body.expirationDate
        }
    )
    try {
        await fifoItem.save()
        console.log(fifoItem)
        res.redirect("/")
    } catch(err){
        if (err) return res.status(500).send(err)
        res.redirect('/')
    }
})

//UPDATE-request for task editing:
app //chain multiple methods together (ex: route, get, post)
    .route("/edit/:id") //pass the object id
    .get((req, res) => {
        const id = req.params.id;
        FifoItem.find({}, (err, items) => {
            res.render("edit.ejs", { 
                fifoBuddyItems: items, idItem: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        FifoItem.findByIdAndUpdate(//mongoose method
            id,
            {
                item: req.body.item,
                expirationDate: req.body.expirationDate
            },

            err => {
                if (err) return res.status(500).send(err);
                res.redirect("/");
            });
    });

//Delete-request for task removal:
app 
    .route("/remove/:id")
    .get((req,res) => {
        const id = req.params.id
        FifoItem.findByIdAndRemove(id, err => {
            if (err) return res.status(500).send(err)
            res.redirect('/')
        })
    })



//app,listen() to initialize the server
app.listen(process.env.PORT || PORT, () => console.log(`Express server is running on port ${PORT}!`))