create database eri

CREATE TABLE `eri`.`anime` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL DEFAULT '',
  PRIMARY KEY(`id`)
)
ENGINE = InnoDB;

CREATE TABLE `eri`.`character` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT '',
  `id_anime` INTEGER UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY(`id`),
  CONSTRAINT `FK_character_1` FOREIGN KEY `FK_character_1` (`id_anime`)
    REFERENCES `anime` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
)
ENGINE = InnoDB;

CREATE TABLE `eri`.`character_photos` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_character` INTEGER UNSIGNED NOT NULL DEFAULT 0,
  `name` VARCHAR(100) NOT NULL DEFAULT '',
  PRIMARY KEY(`id`),
  CONSTRAINT `FK_character_photos_1` FOREIGN KEY `FK_character_photos_1` (`id_character`)
    REFERENCES `character` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
)
ENGINE = InnoDB;

ALTER TABLE `eri`.`character` RENAME TO `eri`.`characters`;

CREATE TABLE `eri`.`user` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL DEFAULT '',
  `password` VARCHAR(100) NOT NULL DEFAULT '',
  PRIMARY KEY(`id`)
)
ENGINE = InnoDB;