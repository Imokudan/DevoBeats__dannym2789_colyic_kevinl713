const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const create = () => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users");
    db.run('CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL
              );
          ');
    db.run('CREATE TABLE IF NOT EXISTS scores (
              songs TEXT NOT NULL,
              highscore INTEGER DEFAULT 0,
              id INTEGER NOT NULL
              );
          ');
    });
  db.close();
}

const createUser = () => {

}

const getUser = () => {

}

const createPass = () => {

}

const getPass = () => {

}

const printdB = () => {

}

const getHighScore = (username) => {
  db.serialize(){
    db.all('SELECT * FROM scores WHERE id = ?', username, function(err, row){
      
    });
  };
  db.close()
}
