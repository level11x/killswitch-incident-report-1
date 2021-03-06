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

var i = 0
let getBreeds = async () => {
  try {
    return axios.get('https://api.bscscan.com/api?module=account&action=tokentx&address=0x0576961aAc8eb06F6A6A6975dFB70cE51065880D&startblock=1&endblock=99999999&sort=desc&apikey=481TIWDQFUPQ91WBT8R21XA21I6GUSYYMG')
      .then(t => {
        var datas = t.data.result
        datas.map((data)=>{
          if (data.to.toUpperCase() === "0x0576961aAc8eb06F6A6A6975dFB70cE51065880D".toUpperCase() && data.from.toUpperCase() !== "0x73feaa1ee314f8c655e354234017be2193c9e24e".toUpperCase()) {
            if (data.contractAddress.toUpperCase() === "0xa527a61703d82139f8a06bc30097cc9caa2df5a6".toUpperCase()) {
              db.one(
                "INSERT INTO all_deposit_lp(hash,wallet,lp_value) VALUES($1,$2,$3) RETURNING id",
                [
                  data.hash,
                  data.from,
                  data.value
                ],
                event => event.id
              ).then(data => {
                // data = a new event id, rather than an object with it
                console.log(data);
              }).catch(e => console.log(e));
            }
          }
        })
      }).finally(() => {console.log(i);})
  } catch (error) {
    console.error(error)
  }
}
  
getBreeds()