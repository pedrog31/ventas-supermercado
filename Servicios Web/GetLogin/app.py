import sys
import rds_config
import pymysql
import hashlib
#rds settings
rds_host  = "compumovilinstance.crbgpj4dbvxi.us-east-2.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except:
    sys.exit()

def handler(event, context):
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado;')
        cur.execute('SELECT contraseña FROM Comprador WHERE correo=%s;', event['email'])
        row = cur.fetchone()
        if(computeMD5hash(row[0]) == event['pass']):
            response = {"response":"comprador"}
            return response
        cur.execute('SELECT contraseña FROM Vendedor WHERE correo=%s;', event['email'])
        row = cur.fetchone()
        if(computeMD5hash(row[0]) == event['pass']):
            response = {"response":"vendedor"}
            return response
        response = {"response":"Fail"}
    return response
    
def computeMD5hash(my_string):
    m = hashlib.md5()
    m.update(my_string.encode('utf-8'))
    return m.hexdigest()