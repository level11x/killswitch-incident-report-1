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
    let totalDifferenceValue = new BN(0);
    // let totalWithdrawValue = new BN(0);

    const deposits = await db.any('SELECT wallet,total_lp_value FROM total_per_wallet');
    const withdraws = await db.any('SELECT wallet,total_lp_value FROM total_withdraw_per_wallet');
    
    // STEP 1 เอา deposit แต่ละตัว ไป find ใน withdraws ว่าลบกันแล้วเหลือเท่าไหร่
    for (let i = 0; i < deposits.length; i++) {
      let find_withdraw = withdraws.find(obj => obj.wallet === deposits[i].wallet);
      if (find_withdraw) { // FOUND แปลว่ามีการถอน
        let totalDepositValue = new BN(0);
        let totalWithdrawValue = new BN(0);
        totalDepositValue = totalDepositValue.add(new BN(deposits[i].total_lp_value))
        totalWithdrawValue = totalWithdrawValue.add(new BN(find_withdraw.total_lp_value))
        // ถอนไม่หมด แสดงว่าเหลืออยู่
        if (!totalDepositValue.eq(totalWithdrawValue)) {
          // console.log("wallet" ,find_withdraw.wallet);
          // console.log("totalDepositValue ",totalDepositValue.toString());
          // console.log("totalWithdrawValue ",totalWithdrawValue.toString());
          // console.log(totalDepositValue.sub(totalWithdrawValue).toString());
          let remain = totalDepositValue.sub(totalWithdrawValue)
          db.one(
            "INSERT INTO total_lp_locked(wallet,total_lp_value) VALUES($1,$2) RETURNING id",
            [
              find_withdraw.wallet,
              remain.toString()
            ],
            event => event.id
          ).then(data => {
            // data = a new event id, rather than an object with it
            console.log(data);
          }).catch(e => console.log(e));
        } 
       
      } else { // NOT FOUND แปลว่าไม่เคยมีการถอนเลย
        //  console.log("This wallet has still locked ",deposits[i].wallet); 
        db.one(
          "INSERT INTO total_lp_locked(wallet,total_lp_value) VALUES($1,$2) RETURNING id",
          [
            deposits[i].wallet,
            deposits[i].total_lp_value
          ],
          event => event.id
        ).then(data => {
          // data = a new event id, rather than an object with it
          console.log(data);
        }).catch(e => console.log(e));     
      }
    }    
    
  }


getBreeds()