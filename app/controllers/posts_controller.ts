import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'

// 유효성 검사(사용자 입력)
const postStoreSchema = vine.compile(
  vine.object({
    name: vine.string().trim().escape(),
    title: vine.string().trim().escape(),
    content: vine.string().trim(),
  })
)

export default class PostsController {
  // 데이터 조회
  public async index({ request, inertia }: HttpContext) {
    // 쿼리 파라미터에서 page와 perPage를 가져오거나 기본값 설정
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const posts = await Post.query()
      .select('id', 'name', 'title', 'viewsCount', 'likesCount', 'createdAt')
      .orderBy('id', 'desc')
      .paginate(page, perPage)

    return inertia.render('posts/index', {
      posts: posts.serialize(),
    })
  }

  public async show({ params, inertia }: HttpContext) {
    const postId = params.id

    const post = await Post.findOrFail(postId)

    return inertia.render('posts/show', { post })
  }

  // 데이터 저장
  public async store({ request, response }: HttpContext) {
    const trx = await db.transaction()

    try {
      const payload = await request.validateUsing(postStoreSchema)

      const post = new Post()
      post.name = payload.name
      post.title = payload.title
      post.content = payload.content

      post.useTransaction(trx)

      await post.save()

      await trx.commit()

      return response.created({
        success: true,
        message: '게시글이 성공적으로 저장되었습니다.',
        post: post,
      })
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
