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
    const queries = await db.any('SELECT * FROM all_deposit_lp');
    const unique = [...new Set(queries.map(item => item.wallet))];
    let BN = web3.utils.BN;
    let totalValue = new BN(0);
    for (let i = 0; i < unique.length; i++) {
      // console.log(unique[i]);
      const queries2 = await db.any('SELECT lp_value FROM all_deposit_lp WHERE wallet = $1', [unique[i]]);
      // if (unique[i] === '0x287c5b2d837a32496ae1a976c17cbc335a366bb4') {
        queries2.map((item) => {
          totalValue = totalValue.add(new BN(item.lp_value))
        })
        // console.log(totalValue.toString());  
        db.one(
          "INSERT INTO total_per_wallet(wallet,total_lp_value) VALUES($1,$2) RETURNING id",
          [
            unique[i],
            totalValue.toString()
          ],
          event => event.id
        ).then(data => {
          // data = a new event id, rather than an object with it
          // console.log(data);
          totalValue = new BN(0)
        }).catch(e => console.log(e));
      // }
      
    }

    
    // const queries2 = await db.any('SELECT lp_value FROM all_deposit_lp WHERE wallet = $1', ["0x287c5b2d837a32496ae1a976c17cbc335a366bb4"]);
    // let BN = web3.utils.BN;
    // let initValue = new BN(0);
    // queries2.map((item) => {
    //   initValue = initValue.add(new BN(item.lp_value))
    // })
    // console.log(initValue.toString());   
    
    
  }


getBreeds()


