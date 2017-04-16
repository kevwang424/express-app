var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var expressValidator = require('express-validator')

var config = require('./knexfile.js')
var env = 'development'

var methodOverride = require('method-override')
var app = express()

//Configure & Initialize knex
var knex = require('knex')(config[env])

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Use MethodOverride Middleware
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// Set Static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next){
  res.locals.errors = null
  next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/', function(req, res){
  knex
  .select()
  .from('users')
  .then( (users) => {
      res.render('index', {
        title: 'Existing Customers',
        users: users
      })
    }
  )
})

app.get('/users/:id/edit', function(req, res){
  knex
  .select()
  .from('users')
  .where('id', req.params.id)
  .then( (user) => {
      res.render('edit', {
        user: user
      })
    }
  )
})

app.put('/users/:id/edit', function(req, res){
  var updatedUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    updated_at: knex.fn.now()
  }
  knex('users')
  .where('id', req.params.id)
  .update(updatedUser)
  .then( () => {
    res.redirect('/')
  })
})


app.post('/users/add', function(req, res){

  req.checkBody('first_name', 'First Name is Required').notEmpty()
  req.checkBody('last_name', 'Last Name is Required').notEmpty()
  req.checkBody('email', 'Email is Required').notEmpty()

  var errors = req.validationErrors()

  if (errors){
    res.render('index', {
      title: 'Existing Customers',
      users: users,
      errors: errors
      })
  } else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
    knex('users')
    .insert(newUser)
    .then( () => {
      res.redirect('/')
    })
  }
})

app.delete('/users/delete/:id', function(req, res){
  knex('users')
  .where('id', req.params.id)
  .del()
  .then ( () => {
    res.redirect('/')
  })
})

app.listen(3000, function(){
  console.log('Server Started on Port 3000....')
})
