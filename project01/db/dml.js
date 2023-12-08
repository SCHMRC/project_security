const {db} = require('./connector');
const query = require('./dmlQuery.json');



const dataBaseConnection = db();


let createClass  = async (idClasse,livello,aula) => {
    return await new Promise( (resolve,reject) => {
        dataBaseConnection.prepare(query.CREATE.CLASSE,[idClasse,livello,aula])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    }
    )
}

let createLocaleBagno  = async (livello) => {
    return await new Promise((resolve,reject)=>{
        dataBaseConnection.prepare(query.CREATE.LOCALEBAGNO,[livello])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    })
}

let createBagno  = async (idLocaleFK) => {
    return await new Promise((resolve,reject)=>{
        dataBaseConnection.prepare(query.CREATE.BAGNO,[idLocaleFK])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    })

}

let createUscita  = async (idClasseFK,timerEnd,stato) => {
  console.log(1234)
    return await new Promise((resolve, reject)=>{
        dataBaseConnection.prepare(query.CREATE.USCITA,[idClasseFK,timerEnd,stato])
            .run((err)=>{ (err)? reject(err) : resolve({"content":"success"}) } ) 
    })
     
}


let createUscitaBagno  = async (idClasseFK,timeStamp,timerEnd,stato,idLocaleFK) => {
    return await new Promise((resolve,reject)=>{
        dataBaseConnection.prepare(query.CREATE.USCITA_BAGNO,[idClasseFK,timeStamp,timerEnd,stato,idLocaleFK])
            .run((err)=>{ 
              if(err){
                console.log(err)
                reject(err)
              }else{
                resolve({"content":"success"}) 
              }
            } ) 
    })
}

let getListClasse = async () => { 
    return await new Promise((resolve, reject) => { 
        dataBaseConnection
            .all(query.READ.ALLCLASSE, (err, rows) => {
              err
                ? reject(err)
                : resolve({ content: "success", result: rows });
          })
    })

}

/*start tempo uscita dalla classe*/
let getUltimaUscitaClasse = async (idClasseFK) => { 
  return await new Promise((resolve, reject) => { 
    dataBaseConnection.get(query.READ.LASTEXITFROMCLASS, [idClasseFK], (err, row) => { 
      if (err) {
        reject(err)
      } else {
        row != undefined
          ? resolve({ content: "success", result: row })
          : resolve({ content: "success", result: "no_match" });
      }
    })
  })
}

/*end tempo uscita dalla classe*/
let getEndUscitaClasseAndata = async (idClasseFK) => { 
  return await new Promise((resolve, reject) => { 
    dataBaseConnection.get(query.READ.LASTENDEXITFROMCLASS, [idClasseFK], (err, row) => { 
      if (err) {
        reject(err)
      } else {
        row != undefined
          ? resolve({ content: "success", result: row })
          : resolve({ content: "success", result: "no_match" });
      }
    })
  })
}

let getClasse = async (idClasse) => {
    return await new Promise((resolve, reject) => {
        dataBaseConnection.get(query.READ.ONECLASSE, [idClasse], (err, row) => {
            if (err) {
                reject(err)
            } else {
                row != undefined
                  ? resolve({ content: "success", result: row })
                  : resolve({ content: "success", result: 'no_match' });
             }
      
      });
    });
};

let getBagni = async (idLocaleFK) => {
    return await new Promise((resolve, reject) => { 
        dataBaseConnection.all(
          query.READ.ALLBAGNO,
          [idLocaleFK],
          (err, rows) => {
            err ? reject(err) : resolve({ content: "success", result: rows });
          }
        );

    })
}

let getLocaliBagni = async () => {
    return await new Promise((resolve, reject) => { 
        dataBaseConnection.all(
          query.READ.ALLLOCALEBAGNO,
          (err, rows) => {
            err ? reject(err) : resolve({ content: "success", result: rows });
          }
        );

    })
}

let getLocale = async (idLocale) => {
  return await new Promise((resolve, reject) => {
    dataBaseConnection.get(
      query.READ.ONELOCALEBAGNO,
      [idLocale],
      (err, row) => {
        err ? reject(err) : resolve({ content: "success", result: row });
      }
    );
  });
};

let getUscite = async () => {
    return await new Promise((resolve, reject) => { 
        dataBaseConnection.all(
          query.READ.ALLUSCITA,
          (err, rows) => {
            err ? reject(err) : resolve({ content: "success", result: rows });
          }
        );

    })
}

let getUsciteStato = async (idClasseFK,stato) => {
    return await new Promise((resolve, reject) => { 
        dataBaseConnection.all(
          query.READ.ONEUSCITASTATO,
          [idClasseFK, stato],
          (err, rows) => {
            err ? reject(err) : resolve({ content: "success", result: rows });
          }
        );

    })
}

let getUsciteTimeStamp = async (idClasseFK, timestamp) => {
    return await new Promise((resolve, reject) => { 
        dataBaseConnection.all(
          query.READ.ONEUSCITATIMESTAMP,
          [idClasseFK, timestamp],
          (err, rows) => {
            err ? reject(err) : resolve({ content: "success", result: rows });
          }
        );

    })
}

let getUsciteSummary = async () => {
  return await new Promise((resolve, reject) => {
    dataBaseConnection.all(
      query.READ.SHOWSUMMARY,
      (err, rows) => {
        err ? reject(err) : resolve({ content: "success", result: rows });
      }
    );
  });
};


module.exports = {
  createClass,
  createLocaleBagno,
  createBagno,
  createUscita,
  createUscitaBagno,
  getListClasse,
  getClasse,
  getBagni,
  getLocaliBagni,
  getLocale,
  getUscite,
  getUsciteStato,
  getUsciteTimeStamp,
  getUsciteSummary,
  getUltimaUscitaClasse,
  getEndUscitaClasseAndata,
};

