CREATE TABLE IF NOT EXISTS `registration` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria',
  `number` int(20) DEFAULT NULL,
  `firstName` varchar(50) NOT NULL COMMENT 'nombre cliente',
  `lastName` varchar(100) NOT NULL COMMENT 'Apellidos cliente',
  `gender` varchar(1) DEFAULT NULL COMMENT 'Genero',
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `permisos` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1 COMMENT = 'tabla de registration';