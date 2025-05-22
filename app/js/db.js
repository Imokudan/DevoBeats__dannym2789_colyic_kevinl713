const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const create = async () => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users;");
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS scores (songs TEXT NOT NULL, highscore INTEGER DEFAULT 0, id INTEGER NOT NULL);");
    });
    console.log("Tables ready");
  db.close();
}

const createUser = (name, pass) => {
  let state = false;
  db.serialize(){
    db.all("SELECT id from users where username = ?", name, function(err, rows){
      if (rows.length == 0){
        db.run("INSERT INTO users (username, password) VALUES (?, ?);", (name, pass));
        console.log("Successfully added user: " + name);
        state = true;
      }
      else{
        console.log("Username " + name + " already exists!");
      }
    });

  };
  db.close()
  return state;
}

const getUser = (user) => {
  let data = "";
  db.serialize(){
    db.get("SELECT * FROM users WHERE username = ?", user, function(err, row){
      console.log("Getting user: " + user);
      data = row.username;
      console.log("Username " + user + " obtained");
    });
  };
  db.close()
  return data;
}

const getPass = (user) => {
  db.serialize(){
    let data = "";
    db.get("SELECT * FROM users WHERE username = ?", user, function(err, row){
      console.log("Getting password for user: " + user);
      data = row.password;
      console.log("Password obtained for user: " + user);
    });
  };
  db.close()
  return data;
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

const setUserScore = (username, song, score) => {
  let state = false;
  db.serialize(){

  }
  db.close;
  return state;
}
