/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { PostRoutes } from '#routes/post.js'

router.on('/').renderInertia('home')

router.get('posts', [() => import('#controllers/posts_controller'), 'index'])
router.get('posts/:id', [() => import('#controllers/posts_controller'), 'show'])

router
  .group(() => {
    PostRoutes()
  })
  .prefix('/api')
