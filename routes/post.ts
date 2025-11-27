/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const postsController = () => import('#controllers/posts_controller')

export const PostRoutes = () => {
  // POST
  router.post('posts', [postsController, 'store'])
}
