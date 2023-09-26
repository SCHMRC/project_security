const sqlite3 = require('sqlite3');

let db = () => {
    return new sqlite3.Database('./db/dataBase.db', (err) => {
        if(err) {
            console.log(err.message)
        }else{
            console.log('DataBase connection success!');   
        }
    });
}

module.exports = {db}






