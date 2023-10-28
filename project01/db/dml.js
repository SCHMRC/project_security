const {db} = require('./connector');
const query = require('./dmlQuery.json');



const dataBaseConnection = db();


let createClass  = async (idClasse,livello,aula) => {
    return new Promise( (resolve,reject) => {
        dataBaseConnection.prepare(query.CREATE.CLASSE,[idClasse,livello,aula])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    }
    )
}

let createLocaleBagno  = async (livello) => {
    return new Promise((resolve,reject)=>{
        dataBaseConnection.prepare(query.CREATE.LOCALEBAGNO,[livello])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    })
}

let createBagno  = async (idLocaleFK) => {
    return new Promise((resolve,reject)=>{
        dataBaseConnection.prepare(query.CREATE.BAGNO,[idLocaleFK])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    })

}

let createUscita  = async (idClasseFK,timerEnd,stato) => {
    return new Promise((resolve, reject)=>{
        dataBaseConnection.prepare(query.CREATE.USCITA,[idClasseFK,timerEnd,stato])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    })
     
}
let createUscitaBagno  = (idClasseFK,timerEnd,stato,idLocaleFK) => {
    return new Promise((resolve,reject)=>{
        dataBaseConnection.prepare(query.CREATE.USCITA_BAGNO,[idClasseFK,timerEnd,stato,idLocaleFK])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    })
}


module.exports = {createClass,createLocaleBagno,createBagno,createUscita,createUscitaBagno}

