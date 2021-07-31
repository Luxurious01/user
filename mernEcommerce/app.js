const express = require('express')
const cors = require('cors')
const app = express()
//app.use(cors())
const mongoose = require("mongoose")
const PORT = 5000
const {MONGOURI} = require('./keys')





mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',() => {
    console.log("connected to mongoDB")
})
mongoose.connection.on('error',() => {
   console.log("err connecting",err)
})


require('./models/User');
//require('./models/post')
//require('./models/admin/auth')
app.use(cors());
app.use(express.json())

app.use(require('./routes/auth'));
app.use(require('./routes/admin/auth'))
app.use(require('./routes/category'))
app.use(require('./routes/product'))
app.use(require('./routes/cart'))
app.use(require('./routes/admin/initialData'))
//app.use(require('./routes/post'))
//app.use(require('./routes/admin/page'))
app.use(require('./routes/address'))
app.use(require('./routes/order'))
app.use(require('./routes/admin/order.admin'))




app.listen(PORT,() => {
    console.log("server is running on",PORT)
})