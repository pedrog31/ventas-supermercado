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
        cur.execute('USE ventas_supermercado2;')
        cur.execute('UPDATE Comprador SET estado = "Eliminado" WHERE tipo_identificacion = %s AND identificacion = %s;', (event['tipo_documento'], event['documento']))
        conn.commit()
    return {"message":"Ok"}
