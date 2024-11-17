DROP TABLE IF EXISTS login;
DROP TABLE IF EXISTS saved_cars;

CREATE TABLE login (
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE saved_cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    engine_type TEXT NOT NULL,
    mileage TEXT NOT NULL,
    horsepower TEXT NOT NULL,
    image_url TEXT NOT NULL
);