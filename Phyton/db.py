import mysql.connector

def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password="amil",
            database="com_db"
        )
        print("MySQL connected!")
        return connection

    except mysql.connector.Error as err:
        print("MySQL connection error:", err)
        return None
