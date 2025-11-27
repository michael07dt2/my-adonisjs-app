import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 100).notNullable()
      table.string('title', 255).notNullable()
      table.text('content').notNullable()
      table.integer('views_count').defaultTo(0).notNullable()
      table.integer('likes_count').defaultTo(0).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
