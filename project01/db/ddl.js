const queries = require('./ddlQuery.json');

function createTableDB(db) {
  // Converti le query in un array
  const queryArray = Object.values(queries);

  // Funzione ricorsiva per eseguire le promesse in serie
  function executeQuery(index) {
    if (index >= queryArray.length) {
      // Tutte le promesse sono state eseguite
      db.close();
      console.log('Tabelle create con successo.');
      return;
    }

    const query = queryArray[index];

    new Promise((resolve, reject) => {
      db.run(query, error => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    })
      .then(() => {
        // Esegui la prossima promessa nella sequenza
        executeQuery(index + 1);
      })
      .catch(error => {
        console.error('Errore durante la creazione delle tabelle:', error);
        db.close();
      });
  }

  // Inizia l'esecuzione delle promesse in serie
  executeQuery(0);
}

module.exports = {createTableDB}
