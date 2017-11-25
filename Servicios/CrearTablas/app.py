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
        cur.execute('DROP DATABASE IF EXISTS ventas_supermercado2;')
        cur.execute('CREATE DATABASE ventas_supermercado2 DEFAULT CHARACTER SET utf8;')
        cur.execute('USE ventas_supermercado2;')
        cur.execute('CREATE TABLE `Comprador`(`tipo_identificacion` VARCHAR(5) NOT NULL, `identificacion` VARCHAR(45) NOT NULL, `correo` VARCHAR(45), `contraseña` VARCHAR(45), `nombre_completo` VARCHAR(45), `direccion` VARCHAR(45), `descuento` VARCHAR(45), `estado` VARCHAR(45), PRIMARY KEY (`tipo_identificacion`, `identificacion`));')
        cur.execute('CREATE TABLE `Vendedor` (`tipo_identificacion` VARCHAR(5) NOT NULL, `identificacion` VARCHAR(45) NOT NULL, `correo` VARCHAR(45), `contraseña` VARCHAR(45), `nombre_completo` VARCHAR(45), `telefono` VARCHAR(45), PRIMARY KEY (`tipo_identificacion`, `identificacion`));')
        cur.execute('CREATE TABLE `Producto` (`nombre` VARCHAR(45), `sku` VARCHAR(45) NOT NULL, `precio` INT, `url_foto` VARCHAR(120), `stock` INT, PRIMARY KEY (`sku`), UNIQUE INDEX `sku_UNIQUE` (`sku` ASC));')
        cur.execute('CREATE TABLE `Venta` (`idCompra` INT AUTO_INCREMENT NOT NULL, `Comprador_tipo_identificacion` VARCHAR(5), `Comprador_identificacion` VARCHAR(45), `precio_productos` INT, `fecha` DATETIME, `valor_descuento` INT, `numeroCuenta` VARCHAR(45), `domicilio` VARCHAR(45), PRIMARY KEY (`idCompra`), CONSTRAINT `fk_Compra_Comprador1` FOREIGN KEY (`Comprador_tipo_identificacion` , `Comprador_identificacion`) REFERENCES `Comprador` (`tipo_identificacion` , `identificacion`));')
        cur.execute('CREATE TABLE `Productos_X_Venta` (`Compra_idCompra` INT NOT NULL, `Producto_sku` VARCHAR(45) NOT NULL, `cantidad` INT, PRIMARY KEY (`Compra_idCompra`, `Producto_sku`), CONSTRAINT `fk_Compra_has_Producto_Compra1` FOREIGN KEY (`Compra_idCompra`) REFERENCES `Venta` (`idCompra`), CONSTRAINT `fk_Compra_has_Producto_Producto1` FOREIGN KEY (`Producto_sku`) REFERENCES `Producto` (`sku`));')
        cur.execute('CREATE TABLE `Banco` (`fechaVencimiento` DATE,`numeroCuenta` VARCHAR(45) NOT NULL,`estadoCuenta` VARCHAR(45),`saldo` INT, PRIMARY KEY (`numeroCuenta`));')
        cur.execute('CREATE TABLE `Domicilio` (`idDomicilio` INT AUTO_INCREMENT NOT NULL, `Comprador_tipo_identificacion` VARCHAR(5), `Comprador_identificacion` VARCHAR(45),`precioDomicilio` INT,`estado` VARCHAR(45),`justificacion` VARCHAR(45),`Compra_idCompra` INT, PRIMARY KEY (`idDomicilio`), CONSTRAINT `fk_domicilio_Comprador1` FOREIGN KEY (`Comprador_tipo_identificacion` , `Comprador_identificacion`)  REFERENCES `Comprador` (`tipo_identificacion` , `identificacion`), CONSTRAINT `fk_domicilio_Compra1` FOREIGN KEY (`Compra_idCompra`) REFERENCES `Venta` (`idCompra`));')
        cur.execute('CREATE TABLE `Transacciones` (`idTran` INT AUTO_INCREMENT NOT NULL, `Comprador_tipo_identificacion` VARCHAR(5), `Comprador_identificacion` VARCHAR(45), `tipo` INT,`valor` INT,`banco_numeroCuenta` VARCHAR(45), fecha DATETIME, PRIMARY KEY (`idTran`), CONSTRAINT `fk_transacciones_banco1` FOREIGN KEY (`banco_numeroCuenta`) REFERENCES `Banco` (`numeroCuenta`));')
        conn.commit()
    return "Tablas creadas o reseteadas"
