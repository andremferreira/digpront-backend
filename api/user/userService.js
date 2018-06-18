const _ = require('lodash')
const User = require('./user')
const bcrypt = require('bcrypt')
const ObjectId = require('mongoose').Types.ObjectId
const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/

User.methods(['get', 'post', 'put', 'delete'])
User.updateOptions({ new: true, runValidators: true })
User.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)
User.before('put', updateUserPass)

User.route('count', function (req, res, next) {
  User.count(function (error, value) {
    if (error) {
      res.status(500).json({ errors: [error] })
    } else {
      res.json({ value })
    }
  })
})

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if (bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({ errors })
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

function updateUserPass(req, res, next) {
  const pass = req.body.pass || ''
  const confirmPass = req.body.conf_pass || ''
  const assConfPass = req.body.assistConfPass || ''
  const assistente = req.body.assistente || []
  const y = assistente.length - 1
  //console.log(y)
  if ( (!pass == '') && (!confirmPass == '')) {
    if (!pass.match(passwordRegex)) {
      return res.status(400).send({
        errors: [
          "A senha precisar conter: Uma letra maiúscula, uma letra minúscula, um número, " +
          "uma caractere especial entre (@#$%) e tamanho entre 6-12 caracteres."
        ]
      })
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(pass, salt)
    if (!bcrypt.compareSync(confirmPass, passwordHash)) {
      return res.status(400).send({ errors: ['Senhas não conferem.'] })
    } else {
      req.body.password = passwordHash
    }
  }

  if (y >= 0 ) {
    const passAssistente = assistente[y].passAssist
    if ( (!passAssistente == '') && (!assConfPass == '')) {
      if (!passAssistente.match(passwordRegex)) {
        return res.status(400).send({
          errors: [
            "A senha precisar conter: Uma letra maiúscula, uma letra minúscula, um número, " +
            "uma caractere especial entre (@#$%) e tamanho entre 6-12 caracteres."
          ]
        })
      }

      const salt2 = bcrypt.genSaltSync()
      const passwordHash2 = bcrypt.hashSync(passAssistente, salt2)
      if (!bcrypt.compareSync(assConfPass, passwordHash2)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
      } else {
        //console.log(passwordHash2)
        req.body.assistente[y].passAssist = passwordHash2
      }
    }
  }

  next()
}

module.exports = User
