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



module.exports = {promise}