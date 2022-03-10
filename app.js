const express = require('express');
const mongoose = require('mongoose');
const { db } = require('./models/todo');
const Todo = require('./models/todo')

//express app
const app = express();
app.use(express.static('./models'));
// app.use(express.)
//promises



//connect to database
const dbURI = 'mongodb+srv://user:test@cluster0.hqg8o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => {
        console.log("connected to db");

        const port = process.env.PORT || 3000;
        // ...
        app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.log(err);
    })

//mongoose and mongo sandbox routes
app.get('/', (req, res) => {
    res.redirect('/all')
})
app.get('/all', (req, res) => {
    Todo.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/create/:n', (req, res) => {
    const n = req.params.n;
    console.log(n);
    var i;
    for (i = 0; i < n; i++) {
        console.log(i);
        const todo = new Todo({
            description: 'Play Boxing',
            completed: false
        })
        todo.save()
            .catch((err) => {
                console.log(err);
            })
        notcompleted();
    }
    res.redirect('/all');
})

app.get('/delete/all', (req, res) => {
    Todo.find()
        .then((result) => {
            result.forEach((item) => {
                Todo.findByIdAndDelete(item._id, () => { })
            })
        })
        .then(() => {
            res.redirect('/all');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    Todo.find()
        .then((result) => {
            Todo.findByIdAndDelete(id, () => { })
        })
        .then(() => {
            res.redirect('/all');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/update/all', (req, res) => {
    Todo.find()
        .then((result) => {
            result.forEach((item) => {
                Todo.findByIdAndUpdate(
                    item._id,
                    { completed: true },
                    (err, docs) => {
                        if (err)
                            console.log(err);
                    })
            });
        })
        .then(() => {
            res.redirect('/all');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/update/:id', (req, res) => {
    const id = req.params.id;
    Todo.find()
        .then((result) => {
            Todo.findByIdAndUpdate(id,
                { completed: true },
                (err, docs) => {
                    if (err)
                        console.log(err);
                })
        })
        .then(() => {
            res.redirect('/all');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.use('*', (req,res) => {
    res.send("Thats a 404");
    res.status(404);
});

function notcompleted() {
    Todo.find()
        .then((result) => {
            result.forEach((item) => {
                console.log(item);
            })
        })
}
// /all - lists all todo
// / - redirects to /all
// /create/:n - create n no of elements
// /update/all - updates all elements from 'completed': false to 'completed': true
// /update/:id - updates an id
// /delete/all - deletes all id
// /delete/:id - deletes an id