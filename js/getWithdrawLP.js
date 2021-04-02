const axios = require('axios')
const pgp = require("pg-promise")(/*options*/); // => Connect Postgres DB

var cn = {
  host: "localhost", // server name or IP address;
  port: 5432,
  database: "killswitch",
  user: "postgres",
  password: "docker"
};

var db = pgp(cn); // database instance;
var hashs = []
var values = []
var i = 0
let getBreeds = async () => {
    try {
      return axios.get('https://api.bscscan.com/api?module=account&action=tokentx&address=0x0576961aAc8eb06F6A6A6975dFB70cE51065880D&startblock=1&endblock=99999999&sort=desc&apikey=481TIWDQFUPQ91WBT8R21XA21I6GUSYYMG')
      .then(t => {
        var datas = t.data.result
        
        // phuketAddr = "0x4f4326e498fe3DB388d06A330C6F4C94497E8995"
        // myAddr = "0x287c5b2D837A32496ae1a976c17cBC335a366BB4"
        datas.map((data)=>{
        

        if (data.from.toUpperCase() === "0x0576961aAc8eb06F6A6A6975dFB70cE51065880D".toUpperCase()) {
          if (data.to.toUpperCase() === "0xa527a61703d82139f8a06bc30097cc9caa2df5a6".toUpperCase()) {
            if (data.tokenSymbol === "Cake-LP") {
              hashs.push(data.hash)
              values.push(data.value)          
            }
          }
         
        }
          // if (data.to.toUpperCase() === "0x0576961aAc8eb06F6A6A6975dFB70cE51065880D".toUpperCase()) {
          //   if (data.from.toUpperCase() === phuketAddr.toUpperCase()) {
          //     console.log(data)   
          //   }
            
          // }

       })
        
      }).finally(() => {console.log(i);})
    } catch (error) {
      console.error(error)
    }

    
  }


getBreeds().then(async () => {
  // values and hashs must be symetric
  console.log(values.length);
  console.log(hashs.length);
  const start = async () => {
    await asyncForEach(hashs, async (hash,id) => {
      const url = `https://api.bscscan.com/api?module=account&action=txlistinternal&txhash=${hash}&apikey=481TIWDQFUPQ91WBT8R21XA21I6GUSYYMG`
      // if (id < 2) {
        const res = await axios.get(url)
        let datas = res.data.result
        datas.map((data) => {
          if (data.from.toUpperCase() === "0x0576961aAc8eb06F6A6A6975dFB70cE51065880D".toUpperCase()) {
            console.log("data.to ",data.to); // Wallet 
            db.one(
              "INSERT INTO all_withdraw_lp(hash,wallet,lp_value) VALUES($1,$2,$3) RETURNING id",
              [
                hashs[id],
                data.to,
                values[id]
              ],
              event => event.id
            ).then(data => {
              // data = a new event id, rather than an object with it
              console.log(data);
            }).catch(e => console.log(e));
            
          }
        })
        // console.log("id ",id);
      // }
      await waitFor(500);
    });
    console.log('Done');
  }
  start();
})

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


