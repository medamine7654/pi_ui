<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260222005746 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE logement (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, city VARCHAR(100) DEFAULT NULL, country VARCHAR(100) DEFAULT NULL, price_per_night NUMERIC(10, 2) NOT NULL, number_of_rooms INT DEFAULT NULL, number_of_beds INT DEFAULT NULL, number_of_bathrooms INT DEFAULT NULL, max_guests INT DEFAULT NULL, square_meters INT DEFAULT NULL, is_active TINYINT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, image_name VARCHAR(255) DEFAULT NULL, image_size INT DEFAULT NULL, image_updated_at DATETIME DEFAULT NULL, host_id INT NOT NULL, category_id INT DEFAULT NULL, INDEX IDX_F0FD44571FB8D185 (host_id), INDEX IDX_F0FD445712469DE2 (category_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE logement ADD CONSTRAINT FK_F0FD44571FB8D185 FOREIGN KEY (host_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE logement ADD CONSTRAINT FK_F0FD445712469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE logement DROP FOREIGN KEY FK_F0FD44571FB8D185');
        $this->addSql('ALTER TABLE logement DROP FOREIGN KEY FK_F0FD445712469DE2');
        $this->addSql('DROP TABLE logement');
    }
}
