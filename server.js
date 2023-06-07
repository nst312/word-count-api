const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./src/apiRoutes');
const cors = require('cors');
const path = require('path')
const mongoose = require("mongoose"); 


const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
.connect("mongodb+srv://nevil:nevil@cluster0.rb4qwkt.mongodb.net/growth?retryWrites=true&w=majority")
.then(() => console.log(` ---------- Connected to DB at : ${"mongodb+srv://nevil:nevil@cluster0.rb4qwkt.mongodb.net/growth?retryWrites=true&w=majority/"} ---------- `))
.catch((err) => console.log(err));

app.use(express.static(path.join(__dirname+"./public")))
// Mount API routes
app.use('/api', apiRoutes);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
