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



module.exports = {promise, setRele}