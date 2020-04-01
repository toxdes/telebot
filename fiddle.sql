CREATE TABLE IF NOT EXISTS subscribers(
  id INTEGER PRIMARY KEY,
  username VARCHAR(240) NOT NULL,
  roll VARCHAR(240) NOT NULL DEFAULT "USER",
  notify BOOLEAN NOT NULL DEFAULT FALSE,
  rating FLOAT NOT NULL DEFAULT 4.5 
);

CREATE TABLE IF NOT EXISTS movies(
    id INTEGER PRIMARY KEY,
    subscriber_id INTEGER REFERENCES subscribers(id),
    rating FLOAT NOT NULL DEFAULT 4.5
);


INSERT INTO subscribers(id, username) VALUES(203223233, "toxicdesire");

INSERT INTO subscribers(id, username) VALUES(938977975, "cool_bro");
INSERT INTO subscribers(id, username) VALUES(049234039, "not_cool_bro");
INSERT INTO subscribers(id, username) VALUES(333977975, "tox");
INSERT INTO subscribers(id, username) VALUES(323977975, "detox");

INSERT INTO movies(id, subscriber_id, rating) VALUES(22,938977975,3.2);
INSERT INTO movies(id, subscriber_id, rating) VALUES(2,938977975,5.2);
INSERT INTO movies(id, subscriber_id, rating) VALUES(32,938977975,9.2);
INSERT INTO movies(id, subscriber_id, rating) VALUES(12,938977975,2.2);
INSERT INTO movies(id, subscriber_id, rating) VALUES(21,938977975,8.2);