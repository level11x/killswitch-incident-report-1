const axios = require('axios')
const pgp = require("pg-promise")(/*options*/); // => Connect Postgres DB
const Web3 = require('web3');

var cn = {
  host: "localhost", // server name or IP address;
  port: 5432,
  database: "killswitch",
  user: "postgres",
  password: "docker"
};

let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
var db = pgp(cn); // database instance;

let getBreeds = async () => {
    const queries = await db.any('SELECT * FROM total_lp_locked');
    let BN = web3.utils.BN;
    let totalValue = new BN(0);
    let totalNewValue = new BN(0);
    let temp = new BN('1000000000000000000');
    queries.map(obj => {
      totalValue = totalNewValue
      totalNewValue = totalValue.add(new BN(obj.total_lp_value))
    })
    
    console.log(totalNewValue.toString());
  }


getBreeds()


