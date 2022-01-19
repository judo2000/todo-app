const express = require('express');
const { append } = require('express/lib/response');
const connection = require('./config');

const PORT = process.env.PORT || 3001;

const app = express();

// turn on body parser
// this creates req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// endpoint to create a todo
// declaring a function as async allows us to use
// await syntax inside of that function
app.post('/api/todos', async (req, res) => {
    const { task } = req.body;
    if (!task) {
        // if there is no task, send an error message
        return res.status(400).json({ error: 'You must provide a task'});
    } 
    // if there is a task, save it to the database
    // JS will TRY to run every single line of code inside of the try{} block
    // if any line of the code throws an error JS will take that error and put
    // that error in the catch block then run the codfe in the catch block
    try {
        const insertQuery = 'INSERT INTO todos(task) VALUES(?);';
        const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
        // putting [] around result destructures the first element of the result
        // array.
        // whever we do an insert, update, or delete query in mysql2 or mysql mpm package
        // it doesn't give us the data that was interacticed with.  In instead tells us
        // information about how many rows were affected and maybe the insertId or updateId of
        // the regarding data.
        // It also gives us an array with 2 elements.  The first one is an object where
        // we have the information we need.  The second one is null or information about the field
        // of that row.
        const [result] = await connection.query(insertQuery, [task]);
        const [todosResult] = await connection.query(getTodoById, [result.insertId]);

        res.json(todosResult[0]);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));