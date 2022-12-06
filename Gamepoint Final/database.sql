CREATE DATABASE registros CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE registros;

CREATE TABLE usuarios
(
    id integer NOT NULL AUTO_INCREMENT,
    nombre varchar(50) NOT NULL,
    contrasenia varchar(50) NOT NULL,
    correo varchar(50),
    PRIMARY KEY(id)
) ENGINE InnoDB;

INSERT INTO usuarios(nombre, contrasenia, correo) 
VALUES 
('Juan', 'hola123', 'juangomez123@gmail.com'),
('Roberto', 'hola456', 'robertolopez456@gmail.com'),
('Jorge', 'hola789', 'jorgesanchez789@outlook.com');