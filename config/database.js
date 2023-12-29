const mongoose = require("mongoose")

const dbConnection= ()=>{
    // connect with db
mongoose.connect(process.env.DB_URI).then((conn)=>{
    console.log(`MongoDB Connected... ${conn.connection.host}`)
})
// .catch((err)=>{
//     console.error(`Data Error : ${err}`)
// })
}

module.exports = dbConnection