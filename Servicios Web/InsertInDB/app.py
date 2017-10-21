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
        cur.execute('INSERT INTO Comprador (tipo_identificacion, identificacion, correo, contraseña, nombre_completo, direccion, descuento) VALUES ("CC", "10293456", "brayan@gmail.com", "ElBrayan", "Brayan Suárez", "Calle 123", null);')
        cur.execute('INSERT INTO Comprador (tipo_identificacion, identificacion, correo, contraseña, nombre_completo, direccion, descuento) VALUES ("CC", "94584032", "pedro@gmail.com", "ElPedro", "Pedro Gallego", "Carrera 95A", null);')
        cur.execute('INSERT INTO Comprador (tipo_identificacion, identificacion, correo, contraseña, nombre_completo, direccion, descuento) VALUES ("CC", "12948402", "juan@gmail.com", "JuanDa", "Juan Araque", "Carrera 80", null);')
        cur.execute('INSERT INTO Vendedor (tipo_identificacion, identificacion, correo, contraseña, nombre_completo, telefono) VALUES ("CC", "43948505", "simon@gmail.com", "ElSimon", "Simon Rodriguez", "5830494");')
        cur.execute('INSERT INTO Producto (sku, nombre, precio, url_foto, stock) VALUES ("7702189017604", "Cheetos", "1200", "http://www.eurosupermercados.com/wp-content/uploads/2016/06/7702189017604frontPROCESSED.png", 5);')
        cur.execute('INSERT INTO Producto (sku, nombre, precio, url_foto, stock) VALUES ("7702047016633", "Mayonesa 1000gr", "16000", "http://www.eurosupermercados.com/wp-content/uploads/2016/06/7702047016633frontPROCESSED.png", 7);')
        conn.commit()
    return "Datos Insertados"