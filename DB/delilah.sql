DROP DATABASE IF EXISTS delilah;
CREATE DATABASE IF NOT EXISTS delilah;
CREATE TABLE delilah.usuarios(
id INT PRIMARY KEY AUTO_INCREMENT,
usuario VARCHAR (255) NOT NULL,
nombreCompleto VARCHAR (255) NOT NULL,
correo VARCHAR (255) NOT NULL,
telefono VARCHAR (255) NOT NULL,
direccion VARCHAR (255) NOT NULL,
contrasena VARCHAR (255) NOT NULL,
rol ENUM('usuario', 'admin') NOT NULL
);
CREATE TABLE delilah.productos(
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR (255) NOT NULL,
descripcion VARCHAR (255) NOT NULL,
precio VARCHAR (255) NOT NULL,
imagen VARCHAR (255) NOT NULL
);
CREATE TABLE delilah.pedidos(
id INT PRIMARY KEY AUTO_INCREMENT,
estado ENUM('nuevo', 'confirmado', 'preparando', 'enviando', 'cancelado', 'entregado') NOT NULL,
hora DATETIME NOT NULL,
total VARCHAR (255) NOT NULL,
metodo ENUM('efectivo', 'credito', 'debito') NOT NULL,
id_usuario INT NOT NULL
);
CREATE TABLE delilah.infoPedido(
id INT PRIMARY KEY AUTO_INCREMENT,
id_pedido INT NOT NULL,
id_producto INT NOT NULL,
cantidad INT NOT NULL
);
INSERT INTO delilah.usuarios 
VALUES (NULL, "dannyB", "Dan Brown", "lostsymbol@gmail.com", "+57 3123456789", "Un misterio", "davinci", "usuario");
INSERT INTO delilah.usuarios 
VALUES (NULL, "agi", "Agatha Christie", "agatha@gmail.com", "+57 3120000000", "En el Nilo", "mystery", "usuario");
INSERT INTO delilah.usuarios 
VALUES (NULL, "haruMura", "Haruki Murakami", "haru@gmail.com", "+57 3124561234", "Japon", "1q84", "admin");
INSERT INTO delilah.productos 
VALUES (NULL, "Bagel de salmón", "BagSal", "425", "https://image.freepik.com/foto-gratis/sandwich-rosca-salmon-ahumado_1147-545.jpg");
INSERT INTO delilah.productos 
VALUES (NULL, "Hamburguesa clásica", "HamClas", "350", "https://image.freepik.com/foto-gratis/hamburguesa-carne-res-hamburguesa-verduras-frescas-superficie-oscura_2829-5883.jpg");
INSERT INTO delilah.productos 
VALUES (NULL, "Sandwich veggie", "SandVegg", "310", "https://image.freepik.com/foto-gratis/sabroso-sandwich-vegano-sobre-mesa-madera_144627-42721.jpg");
INSERT INTO delilah.productos 
VALUES (NULL, "Ensalada veggie", "Veggie", "340", "https://image.freepik.com/foto-gratis/ensalada-tomate-pepino-cebolla-morada-hojas-lechuga-menu-saludable-vitaminas-verano-comida-vegetariana-vegana-mesa-cena-vegetariana_2829-6473.jpg");
INSERT INTO delilah.productos 
VALUES (NULL, "Focaccia", "Focaccia", "300", "https://image.freepik.com/foto-gratis/deliciosos-rollos-carne-comida-rapida-arabe-focaccia_23-2148651127.jpg");
INSERT INTO delilah.pedidos
VALUES (NULL, "entregado", "2020-01-01 10:10:10", "660", "efectivo", 1);
INSERT INTO delilah.pedidos
VALUES (NULL, "nuevo", "2020-10-27 13:10:10", "765", "credito", 2);
INSERT INTO delilah.pedidos
VALUES (NULL, "preparando", "2020-10-27 20:10:10", "600", "debito", 3);
INSERT INTO delilah.pedidos
VALUES (NULL, "cancelado", "2020-09-15 18:15:10", "640", "credito", 2);
INSERT INTO delilah.infoPedido
VALUES (NULL, 1, 2, 1);
INSERT INTO delilah.infoPedido
VALUES (NULL, 1, 3, 1);
INSERT INTO delilah.infoPedido
VALUES (NULL, 2, 1, 1);
INSERT INTO delilah.infoPedido
VALUES (NULL, 2, 4, 1);
INSERT INTO delilah.infoPedido
VALUES (NULL, 3, 5, 2);
INSERT INTO delilah.infoPedido
VALUES (NULL, 4, 4, 1);
INSERT INTO delilah.infoPedido
VALUES (NULL, 4, 5, 1);