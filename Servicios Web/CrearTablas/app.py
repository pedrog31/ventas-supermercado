import sys
import rds_config
import pymysql
#rds settings
rds_host  = 'compumovilinstance.crbgpj4dbvxi.us-east-2.rds.amazonaws.com'
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except:
    sys.exit()
    
def handler(event, context):
    with conn.cursor() as cur:
        cur.execute("DROP DATABASE IF EXISTS ventas_supermercado;")
        cur.execute('CREATE DATABASE ventas_supermercado DEFAULT CHARACTER SET utf8;')
        cur.execute('USE ventas_supermercado;')
        cur.execute('CREATE TABLE `Comprador`(`tipo_identificacion` VARCHAR(5) NOT NULL, `identificacion` VARCHAR(45) NOT NULL, `correo` VARCHAR(45) NOT NULL, `contraseña` VARCHAR(45) NOT NULL, `nombre_completo` VARCHAR(45) NOT NULL, `direccion` VARCHAR(45) NOT NULL, `descuento` VARCHAR(45), PRIMARY KEY (`tipo_identificacion`, `identificacion`));')
        cur.execute('CREATE TABLE `Vendedor` (`tipo_identificacion` VARCHAR(5) NOT NULL, `identificacion` VARCHAR(45) NOT NULL, `correo` VARCHAR(45) NOT NULL, `contraseña` VARCHAR(45) NOT NULL, `nombre_completo` VARCHAR(45) NOT NULL, `telefono` VARCHAR(45) NOT NULL, PRIMARY KEY (`tipo_identificacion`, `identificacion`));')
        cur.execute('CREATE TABLE `Producto` (`nombre` VARCHAR(45) NOT NULL, `sku` VARCHAR(45) NOT NULL, `precio` INT NOT NULL, `url_foto` VARCHAR(120) NOT NULL, `stock` INT NOT NULL, PRIMARY KEY (`sku`), UNIQUE INDEX `sku_UNIQUE` (`sku` ASC));')
        cur.execute('CREATE TABLE `Venta` (`idCompra` INT NOT NULL AUTO_INCREMENT, `Comprador_tipo_identificacion` VARCHAR(5) NOT NULL, `Comprador_identificacion` VARCHAR(45) NOT NULL, `precio_productos` INT NOT NULL, `fecha` DATETIME NOT NULL, `precio_domicilio` INT NULL, `valor_descuento` INT NULL, PRIMARY KEY (`idCompra`), CONSTRAINT `fk_Compra_Comprador1` FOREIGN KEY (`Comprador_tipo_identificacion` , `Comprador_identificacion`) REFERENCES `Comprador` (`tipo_identificacion` , `identificacion`));')
        cur.execute('CREATE TABLE `Productos_X_Venta` (`Compra_idCompra` INT NOT NULL, `Producto_sku` VARCHAR(45) NOT NULL, `cantidad` INT NOT NULL, PRIMARY KEY (`Compra_idCompra`, `Producto_sku`), CONSTRAINT `fk_Compra_has_Producto_Compra1` FOREIGN KEY (`Compra_idCompra`) REFERENCES `Venta` (`idCompra`), CONSTRAINT `fk_Compra_has_Producto_Producto1` FOREIGN KEY (`Producto_sku`) REFERENCES `Producto` (`sku`));')
        conn.commit()
    return 'Tablas creadas o reseteadas'