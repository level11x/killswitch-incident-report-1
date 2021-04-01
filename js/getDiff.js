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
    let BN = web3.utils.BN;
    let totalDepositValue = new BN(0);
    let totalWithdrawValue = new BN(0);
    const queries1 = await db.any('SELECT * FROM all_deposit_lp');
    queries1.map((query1) =>{
      totalDepositValue = totalDepositValue.add(new BN(query1.lp_value))
    })
    console.log("total deposit : ",totalDepositValue.toString());
    const queries2 = await db.any('SELECT * FROM all_withdraw_lp');
    queries2.map((query2) =>{
      totalWithdrawValue = totalWithdrawValue.add(new BN(query2.lp_value))
    })
    console.log("total withdraw : ",totalWithdrawValue.toString());
    console.log("total remain locked : ",totalDepositValue.sub(totalWithdrawValue).toString());
  }


getBreeds()


