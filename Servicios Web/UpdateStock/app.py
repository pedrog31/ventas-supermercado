import sys
import rds_config
import pymysql
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
        cur.execute('SELECT stock FROM Producto WHERE sku = %s', event['sku'])
        row = cur.fetchone()
        nuevoStock = row[0] + int(event['stock'])
        cur.execute('UPDATE Producto SET stock = %s WHERE sku = %s;', (nuevoStock, event['sku']))
    conn.commit()
    response = {"response":"Ok","message":"Stock actualizado con éxito"}
    return response