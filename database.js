const mongoose = require("mongoose")

class Database {

    // Making the constructor call the connect function.
    constructor(){
        this.connect()
    }

    connect() {
        mongoose.connect("mongodb://127.0.0.1/twitter-test")
        .then(() => {
            console.log("Database connection successful")
        })
        .catch((err) => {
            console.log(`Database connection error ${err}`)
        })
    }
}

module.exports = new Database()