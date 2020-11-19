const {Sequelize} = require('sequelize');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const db = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/`);

fs.readFile('./DB/delilah.sql', 'utf8', (err, data) => {
  if(err) {
    console.error(err);
  }

  myData = data.split(";");
  myData.forEach(query => {
    if(query){
      q = query.replace(/(\r\n|\n|\r)/gm," ");
      db.query(q)
      .then(res => console.log(res))
      .catch(err => console.error(err));
    }
  });

});

module.exports =  {
  db
}