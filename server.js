const { application } = require('express');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const dbFile = './db/db.json';

// Allows access to url/filename directly such as simpletextfile.txt.  
app.use(express.static('public'));

// Middleware for parsing application/json
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  console.log('Now in /notes to get notes.html'); console.log('');
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {
  fs.readFile(dbFile, 'utf8', (error, data) => {
    if(error) {
      console.log('Error occurred when reading file:', dbFile, error);
      res.status(500).send('Error occurred when reading file:', dbFile, error);
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const {title, text} = req.body;
  const note = { title, text };

  fs.readFile(dbFile, 'utf8', (error, data) => {
    if(error) console.log('Error occurred when reading file:', error);
    
    let notes = [];
    if (data) notes = JSON.parse(data);
    
    notes.unshift(note);

    fs.writeFile(dbFile, JSON.stringify(notes), (error) => {
      if (error) {
        console.log('Error occurred when adding note', error);
        res.status(500).json('Error occurred when adding note');
      } else {
        console.log('note added:', note)
        res.status(200).send(JSON.stringify(note));
      }
    });
  });

});


// Fallback route for when a user attempts to visit routes that don't exist
app.get('*', (req, res) => res.send(`The URL you requested was not found`));

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

