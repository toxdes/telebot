exports.q = {
  drop_tables: `DROP TABLE rating; DROP TABLE movies; DROP TABLE subscribers;`,
  create_tables: `
    CREATE TABLE IF NOT EXISTS subscribers(
        id INTEGER PRIMARY KEY,
        username VARCHAR(240) NOT NULL,
        roll VARCHAR(240) DEFAULT 'USER',
        notifications BOOLEAN DEFAULT TRUE,
        rating NUMERIC DEFAULT 4.5 
      );
      
      CREATE TABLE IF NOT EXISTS movies(
          id INTEGER PRIMARY KEY,
          subscriber_id INTEGER REFERENCES subscribers(id),
          rating NUMERIC NOT NULL DEFAULT 4.5
      );
      
      
      CREATE TABLE IF NOT EXISTS rating(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        username VARCHAR(240) NOT NULL,
        movie_id INTEGER NOT NULL REFERENCES movies(id),
        rating NUMERIC NOT NULL DEFAULT 4.5,
        CONSTRAINT unique_user_movie UNIQUE (user_id, movie_id)
    );

    `,
  insert_dummy: `
        INSERT INTO subscribers(id, username) VALUES(938977975, 'cool_bro');
        INSERT INTO subscribers(id, username) VALUES(049234039, 'not_cool_bro');
        INSERT INTO subscribers(id, username) VALUES(049234031, 'tox');
        INSERT INTO subscribers(id, username) VALUES(049234042, 'detox');
    `,
  select_subs: "select * from subscribers;",
  get_notified_users: `select id,username from subscribers where notifications=TRUE;`,
  add_movie: `INSERT INTO movies(id, subscriber_id) VALUES($1,$2);`,
  privilige_level: `SELECT roll FROM subscribers WHERE id=$1`,
  rate_movie: `INSERT INTO rating(
  user_id, username, movie_id, rating)
  VALUES
  ($1,$2,$3,$4) ON CONFLICT ON CONSTRAINT unique_user_movie DO UPDATE SET rating=excluded.rating;
  `,
  subscribe: `INSERT INTO subscribers(id, username) VALUES($1,$2);`,
  update_privilige: `UPDATE subscribers SET roll=$2 where id=$1;`,
  is_subbed: `SELECT * FROM subscribers WHERE id=$1;`,
  start_notifications: `UPDATE subscribers SET notifications=TRUE WHERE id=$1;`,
  stop_notifications: `UPDATE subscribers SET notifications=FALSE WHERE id=$1;`,
  get_active_gods: `SELECT * FROM subscribers where roll=$1 AND notifications=TRUE`
};
