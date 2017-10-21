import sys
import logging
import rds_config
import pymysql
import json
#rds settings
rds_host  = "compumovilinstance.crbgpj4dbvxi.us-east-2.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except:
    logger.error("ERROR: Unexpected error: Could not connect to MySql instance.")
    sys.exit()

logger.info("SUCCESS: Connection to RDS mysql instance succeeded")
def handler(event, context):
    """
    This function fetches content from mysql RDS instance
    """
    productos = []
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado;')
        cur.execute('SELECT COUNT(idCompra) FROM Venta WHERE MONTH(fecha) = %s;', event['mes'])
        row = cur.fetchone()
        response = {"cantidad":row[0]}
        conn.commit()
    return response