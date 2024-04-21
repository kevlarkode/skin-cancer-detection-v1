// Requiring module
const express = require("express");
const app = express();
const path = require("path")
const PORT = process.env.PORT || 1234;

// Set public as static directory
app.use(express.static('public'));

app.set('views', path.join(__dirname, '/views'))

// Use ejs as template engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Render main template
app.get('/',(req,res)=>{
	res.render('index')
})
app.get('/views/about.ejs',(req,res)=>{
	res.render('about')
})

// Server setup
app.listen(PORT, () => {
console.log("The server started running on port 1234")
});
