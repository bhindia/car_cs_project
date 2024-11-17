import sqlite3

connection = sqlite3.connect('database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO login (userid, username, password) VALUES (?, ?, ?)",
            (1,'ashwin', 'password11')
            )

cur.execute("INSERT INTO login (userid, username, password) VALUES (?, ?, ?)",
            (2,'swayam', 'pasword22')
            )

connection.commit()
connection.close()