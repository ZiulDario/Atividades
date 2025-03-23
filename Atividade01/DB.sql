CREATE DB RestaurantDB;
USE RestaurantDB;

CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    locations INT NOT NULL,
    hourvalues DECIMAL(3,1) NOT NULL
);

CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    names VARCHAR(100) NOT NULL,
    emails VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    names VARCHAR(100) NOT NULL,
    prices DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tId INT NOT NULL,
    cId INT NOT NULL,
    dates DATE NOT NULL,
    status ENUM('reserved', 'canceled', 'open', 'payment', 'closed') NOT NULL,
    FOREIGN KEY (tId) REFERENCES locations(id),
    FOREIGN KEY (cId) REFERENCES clients(id)
);

CREATE TABLE productsche (
    sId INT NOT NULL,
    pId INT NOT NULL,
    quantitys INT NOT NULL,
    PRIMARY KEY (sId, pId),
    FOREIGN KEY (sId) REFERENCES orders(id),
    FOREIGN KEY (pId) REFERENCES products(id)
);

INSERT INTO locations (locations, hourvalues) VALUES (14, 4.0), (12, 3.0), (10, 5.0);
INSERT INTO clients (names, emails) VALUES ('Laurindo', 'email@email'), ('Claudia', 'Email1@email'), ('Laura', 'Email2@email');
INSERT INTO products (names, prices) VALUES ('Ovo Frito', 4.0), ('Hamburger', 10.0), ('Picanha', 200), ('Café', 45);
INSERT INTO orders (tId, cId, dates, status) VALUES (1, 2, '2025-03-29', 'open'), (3, 1, '2025-03-01', 'open');
INSERT INTO productsche (sId, pId, quantitys) VALUES (1, 3, 1), (1, 2, 2), (2, 1, 1);

-- A) Listar o número de produtos e a quantidade de um determinado pedido

SELECT 
o.id AS order_id,
COUNT(ps.pId) AS product_count,
SUM(ps.quantitys) AS total_quantity
FROM 
orders o
JOIN 
productsche ps ON o.id = ps.sId
WHERE 
o.id = 1
GROUP BY 
o.id;

-- B) Procedure para limitar os pedidos apenas a mesas que estejam em atendimento

DELIMITER //

CREATE PROCEDURE LimitOrdersToActiveTables()
BEGIN
    DELETE FROM orders
    WHERE tId NOT IN (
        SELECT locations 
        FROM hourvalues 
        WHERE hourvalues > 3
    );
END //

DELIMITER ;

-- C) Procedure para atualizar a quantidade de produtos com chaves primárias duplas

DELIMITER //

CREATE PROCEDURE UpdateProductQuantity(
    IN sId INT,
    IN pId INT,
    IN new_quantity INT
)
BEGIN
    UPDATE productsche
    SET quantitys = new_quantity
    WHERE sId = sId AND pId = pId; 
END //

DELIMITER ;

-- D) Listar o nome dos produtos, a quantidade, o valor total de cada produto e o valor total da compra

SELECT 
    p.names AS product_name,
    ps.quantitys AS quantity,
    (p.prices * ps.quantitys) AS total_per_product,
    (SUM(p.prices * ps.quantitys) OVER (PARTITION BY o.id)) AS total_purchase
FROM 
    orders o
JOIN 
    productsche ps ON o.id = ps.sId
JOIN 
    products p ON ps.pId = p.id
WHERE 
    o.id = 1
ORDER BY 
    p.names;
