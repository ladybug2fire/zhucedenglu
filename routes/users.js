const router = require('koa-router')()
const UserController = require('../controllers/user');
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/register', async function(ctx, next){
  await ctx.render('register')
})

router.post('/register', UserController.register)

router.get('/getCode', UserController.getCode)

router.get('/authImage', UserController.authImage)

router.get('/login', UserController.login)

router.get('/:id', )

module.exports = router
