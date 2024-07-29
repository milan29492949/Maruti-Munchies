const express = require('express')
const ejs = require('ejs');
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')
const expressValidator = require('express-validator')
var flash = require('connect-flash');
const fileUpload = require('express-fileupload');




const mainRouter = require('./routes/mainRoute');
const adminRouter = require('./routes/adminRoute');

const port = 3000
const app = express();


app.use(session({
	secret : '1234567890abcdefghijklmnopqrstuvwxyz',
	resave : false,
	saveUninitialized : true,
	cookie : { secure : false }
}));


// app.use(fileUpload());
// app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(flash());




app.set('view engine', 'ejs')



app.use(express.static(__dirname + '/public'));



app.use('/', mainRouter)
app.use('/backoffice',adminRouter)


// app.use('/flavours', flavoursRouter)
// app.use('/about', aboutRouter)
// app.use('/login', loginRouter)
// app.use('/contact', contactRouter)
// app.use('/wishlist', wishlistRouter)
// app.use('/cart', cartRouter)
// app.use('/checkout', checkoutRouter)
// app.get('*', (req, resp) => {
// 	resp.render('404')
// })

app.listen(port ,() => {
    console.log(`App is running at port ${port}`)
})