<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260208195311 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        // Commented out - these tables don't exist in fresh install
        // $this->addSql('ALTER TABLE service_booking DROP FOREIGN KEY `FK_2F88BF429A4AA658`');
        // $this->addSql('ALTER TABLE service_booking DROP FOREIGN KEY `FK_2F88BF42ED5CA9E6`');
        // $this->addSql('ALTER TABLE service_report DROP FOREIGN KEY `FK_FAE872B271CE806`');
        // $this->addSql('ALTER TABLE service_report DROP FOREIGN KEY `FK_FAE872B2ED5CA9E6`');
        // $this->addSql('ALTER TABLE service_tool DROP FOREIGN KEY `FK_EEB08A3D8F7B22CC`');
        // $this->addSql('ALTER TABLE service_tool DROP FOREIGN KEY `FK_EEB08A3DED5CA9E6`');
        // $this->addSql('ALTER TABLE tool_rental DROP FOREIGN KEY `FK_7348CE618F7B22CC`');
        // $this->addSql('ALTER TABLE tool_rental DROP FOREIGN KEY `FK_7348CE619A4AA658`');
        // $this->addSql('ALTER TABLE tool_report DROP FOREIGN KEY `FK_A17E7B9871CE806`');
        // $this->addSql('ALTER TABLE tool_report DROP FOREIGN KEY `FK_A17E7B988F7B22CC`');
        // $this->addSql('DROP TABLE category');
        // $this->addSql('DROP TABLE service_booking');
        // $this->addSql('DROP TABLE service_report');
        // $this->addSql('DROP TABLE service_tool');
        // $this->addSql('DROP TABLE tool_rental');
        // $this->addSql('DROP TABLE tool_report');
        // $this->addSql('DROP INDEX idx_service_active ON service');
        // $this->addSql('ALTER TABLE service DROP max_guests_per_booking, DROP image_path, DROP is_suspended, DROP category_id');
        // $this->addSql('ALTER TABLE service RENAME INDEX idx_service_host TO IDX_E19D9AD21FB8D185');
        // $this->addSql('DROP INDEX idx_tool_active ON tool');
        // $this->addSql('ALTER TABLE tool DROP deposit_amount, DROP condition_notes, DROP image_path, DROP is_suspended, DROP category_id');
        // $this->addSql('ALTER TABLE tool RENAME INDEX idx_tool_host TO IDX_20F33ED11FB8D185');
        // $this->addSql('ALTER TABLE user DROP avatar, DROP updated_at');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, type VARCHAR(20) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, is_active TINYINT NOT NULL, created_at DATETIME NOT NULL, INDEX idx_category_active (is_active), INDEX idx_category_type (type), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE service_booking (id INT AUTO_INCREMENT NOT NULL, reservation_id INT DEFAULT NULL, scheduled_date DATE NOT NULL, scheduled_time TIME DEFAULT NULL, quantity INT NOT NULL, price NUMERIC(10, 2) NOT NULL, status VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, service_id INT NOT NULL, guest_id INT NOT NULL, INDEX idx_servicebooking_status (status), INDEX idx_servicebooking_date (scheduled_date), INDEX idx_servicebooking_service (service_id), INDEX IDX_2F88BF429A4AA658 (guest_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE service_report (id INT AUTO_INCREMENT NOT NULL, reason LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, status VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, created_at DATETIME NOT NULL, service_id INT NOT NULL, reported_by_id INT NOT NULL, INDEX IDX_FAE872B271CE806 (reported_by_id), INDEX idx_servicereport_service (service_id), INDEX idx_servicereport_status (status), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE service_tool (id INT AUTO_INCREMENT NOT NULL, is_required TINYINT NOT NULL, is_suggested TINYINT NOT NULL, service_id INT NOT NULL, tool_id INT NOT NULL, INDEX idx_servicetool_service (service_id), INDEX idx_servicetool_tool (tool_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE tool_rental (id INT AUTO_INCREMENT NOT NULL, reservation_id INT DEFAULT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, quantity INT NOT NULL, price_per_day NUMERIC(10, 2) NOT NULL, total_price NUMERIC(10, 2) NOT NULL, status VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, tool_id INT NOT NULL, guest_id INT NOT NULL, INDEX idx_toolrental_status (status), INDEX idx_toolrental_dates (start_date, end_date), INDEX idx_toolrental_tool (tool_id), INDEX IDX_7348CE619A4AA658 (guest_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE tool_report (id INT AUTO_INCREMENT NOT NULL, reason LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, status VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, created_at DATETIME NOT NULL, tool_id INT NOT NULL, reported_by_id INT NOT NULL, INDEX idx_toolreport_status (status), INDEX idx_toolreport_tool (tool_id), INDEX IDX_A17E7B9871CE806 (reported_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE service_booking ADD CONSTRAINT `FK_2F88BF429A4AA658` FOREIGN KEY (guest_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE service_booking ADD CONSTRAINT `FK_2F88BF42ED5CA9E6` FOREIGN KEY (service_id) REFERENCES service (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE service_report ADD CONSTRAINT `FK_FAE872B271CE806` FOREIGN KEY (reported_by_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE service_report ADD CONSTRAINT `FK_FAE872B2ED5CA9E6` FOREIGN KEY (service_id) REFERENCES service (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE service_tool ADD CONSTRAINT `FK_EEB08A3D8F7B22CC` FOREIGN KEY (tool_id) REFERENCES tool (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE service_tool ADD CONSTRAINT `FK_EEB08A3DED5CA9E6` FOREIGN KEY (service_id) REFERENCES service (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE tool_rental ADD CONSTRAINT `FK_7348CE618F7B22CC` FOREIGN KEY (tool_id) REFERENCES tool (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE tool_rental ADD CONSTRAINT `FK_7348CE619A4AA658` FOREIGN KEY (guest_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE tool_report ADD CONSTRAINT `FK_A17E7B9871CE806` FOREIGN KEY (reported_by_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE tool_report ADD CONSTRAINT `FK_A17E7B988F7B22CC` FOREIGN KEY (tool_id) REFERENCES tool (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE service ADD max_guests_per_booking INT NOT NULL, ADD image_path VARCHAR(255) DEFAULT NULL, ADD is_suspended TINYINT NOT NULL, ADD category_id INT NOT NULL');
        $this->addSql('CREATE INDEX idx_service_active ON service (is_active)');
        $this->addSql('ALTER TABLE service RENAME INDEX idx_e19d9ad21fb8d185 TO idx_service_host');
        $this->addSql('ALTER TABLE tool ADD deposit_amount NUMERIC(10, 2) DEFAULT NULL, ADD condition_notes VARCHAR(255) DEFAULT NULL, ADD image_path VARCHAR(255) DEFAULT NULL, ADD is_suspended TINYINT NOT NULL, ADD category_id INT NOT NULL');
        $this->addSql('CREATE INDEX idx_tool_active ON tool (is_active)');
        $this->addSql('ALTER TABLE tool RENAME INDEX idx_20f33ed11fb8d185 TO idx_tool_host');
        $this->addSql('ALTER TABLE `user` ADD avatar VARCHAR(255) DEFAULT NULL, ADD updated_at DATETIME NOT NULL');
    }
}
