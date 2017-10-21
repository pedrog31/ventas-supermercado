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
    """
    This function fetches content from mysql RDS instance
    """
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado;')
        cur.execute('SELECT nombre FROM Producto WHERE sku=%s',event['sku'])
        if(cur.rowcount!=0):
            row = cur.fetchone()
            response = {"response":"Fail","message":"El Producto " + row[0] + " ya existe."}
            conn.commit()
            return response
        cur.execute('INSERT INTO Producto (sku, nombre, precio, url_foto, stock) VALUES (%s, %s, %s, %s, %s);',(event['sku'],event['nombre'], int(event['precio']), event['url_foto'],int(event['stock'])))
        conn.commit()
    response = {"response":"Ok","message":"Producto insertado con éxito"}
    return response