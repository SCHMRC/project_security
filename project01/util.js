function promise(relayPin,listClass,idCard){
    return new Promise((resolve,reject)=>{
        console.log(listClass.includes(idCard));
        try {
          if(listClass.includes(idCard)){
            relayPin.writeSync(0);
            resolve(false)
        }else{
            relayPin.writeSync(1);
            resolve(true)
        }
          
        } catch (error) {
          reject(error)
          
        }
      })
}

function getCustomDate(){
  // Ottieni la data corrente 
  let dataCorrente = new Date();
  // Formatta la data nel formato desiderato
  let anno = dataCorrente.getFullYear();
  let mese = pad(dataCorrente.getMonth() + 1); // i mesi sono indicizzati da 0 a 11
  let giorno = pad(dataCorrente.getDate());
  let ore = pad(dataCorrente.getHours());
  let minuti = pad(dataCorrente.getMinutes());
  let secondi = pad(dataCorrente.getSeconds()+1);

  // Crea la stringa nel formato richiesto
  let timeStamp = `${anno}-${mese}-${giorno} ${ore}:${minuti}:${secondi}`;
  return timeStamp
}

// Funzione per aggiungere uno zero davanti a numeri inferiori a 10
function pad(numero) {
  return numero < 10 ? '0' + numero : numero;
}

function setRele(rele){
  let currentState = rele.readSync();
  let state;
  if (currentState) {
    rele.writeSync(0);
    state = 'ON';
  } else {
    rele.writeSync(1);
    state = 'OFF';
  }
  return state;
}



module.exports = {promise, setRele,getCustomDate}