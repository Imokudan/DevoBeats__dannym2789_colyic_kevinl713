const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const create = async () => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users");
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL,password TEXT NOT NULL)');
    db.run('CREATE TABLE IF NOT EXISTS scores (songs TEXT NOT NULL, highscore INTEGER DEFAULT 0, id INTEGER NOT NULL)');
    });
  db.close();
}

const createUser = () => {
  db.serialize(){

  };
  db.close()
}

const getUser = function() {
  let data;
  db.serialize(){
    db.get('SELECT * FROM users WHERE id = ?', username, function(err, row){
      console.log("Getting user: " + username);
      data = row["username"];
      console.log("Username " + username + " obtained");
    });
  };
  db.close()
  return data;
}

const createPass = () => {
  db.serialize(){

  };
  db.close()
}

const getPass = () => {
  db.serialize(){

  };
  db.close()
}

const printdB = () => {
  db.serialize(){

  };
  db.close()
}

const getUserScores = (username) => {
  let userscores = [];
  db.serialize(){
    db.all('SELECT * FROM scores WHERE id = ?', username, function(err, rows){
      console.log("Getting high scores of user: " + username);
      for (let i = 0; i < userscores.length; i++){
        userscores.push(rows[i]);
      }
      console.log("User high scores obtained");
      console.log("User: " + username + "'s scores: " + userscores)
    });
  };
  db.close()
  return userscores;
}
