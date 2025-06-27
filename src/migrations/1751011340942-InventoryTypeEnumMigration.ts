import { MigrationInterface, QueryRunner } from "typeorm";

export class InventoryTypeEnumMigration1751011340942 implements MigrationInterface {
    name = 'InventoryTypeEnumMigration1751011340942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`inventories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`purchasePrice\` decimal(10,2) NOT NULL, \`totalValue\` decimal(10,2) NOT NULL, \`type\` enum ('IN', 'OUT') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`discount\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`inventories\` ADD CONSTRAINT \`FK_19f6e91bd3b53e47103305f3f84\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_19f6e91bd3b53e47103305f3f84\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`discount\``);
        await queryRunner.query(`DROP TABLE \`inventories\``);
    }

}
