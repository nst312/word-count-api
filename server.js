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
.connect("mongodb+srv://nevil:nevil@cluster0.rb4qwkt.mongodb.net/?retryWrites=true&w=majority/growth")
.then(() => console.log(` ---------- Connected to DB at : ${"mongodb+srv://nevil:nevil@cluster0.rb4qwkt.mongodb.net/?retryWrites=true&w=majority/growth"} ---------- `))
.catch((err) => console.log(err));

app.use(express.static(path.join(__dirname+"./public")))
// Mount API routes
app.use('/api', apiRoutes);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
