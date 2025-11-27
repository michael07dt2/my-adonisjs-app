import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Post extends BaseModel {
  public static table = 'posts'

  @column({ isPrimary: true })
  declare id: number

  @column()
  public name!: string

  @column()
  public title!: string

  @column()
  public content!: string

  @column()
  public viewsCount!: number

  @column()
  public likesCount!: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
