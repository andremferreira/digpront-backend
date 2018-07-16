const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Encrypt = require('../encrypt/encrypt')
const User = require('./user')
const env = require('../../.env')
const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/
const ObjectId = require('mongoose').Types.ObjectId
const Recovery = require('../recovery/sendRecovery')

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''
    const medico = "medicoid"
    const dt = new Date()
    const dt2 = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, env.authSecret, {
                expiresIn: "1 day"
            })
            const perfil = 2
            //console.log(user.validade)
            if ( user.validade < dt ){
              //console.log('menor')
              const vencido = true
              const { nome, email, _id, medicoId  } = user
              res.json({ nome, email, _id, medicoId, perfil, vencido, token })
            } else{
              //console.log('maior')
              const vencido = false
              const { nome, email, _id, medicoId  } = user
              res.json({ nome, email, _id, medicoId, perfil, vencido, token })
            }
        } else {
            return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
        }
    })
}

const loginAssist = (req, res, next) => {
    const medCrm = req.body.crm || ''
    const emailAst = req.body.emailAssist || ''
    const passAst = req.body.passAssist || ''
    User.aggregate(
      { $match: {crm: medCrm, "assistente.emailAssist": emailAst } },
      { $project: { medicoId: "$medicoId",
        			  crm:"$crm",
        			  assistente:"$assistente"
         } },
      { $unwind: "$assistente"},
      { $match: {"assistente.emailAssist": emailAst } },
      { $project: { _id:1, validade:1, crm:1, medicoId:1, "assistente.nomeAssist":1, "assistente.emailAssist":1, "assistente.passAssist":1, "assistente._id":1} },
      { $project: { _id: "$_id",
                    validade: "$validade",
                    crm: "$crm",
            			  medicoId: "$medicoId",
                    nomeAssist: "$assistente.nomeAssist",
            			  emailAssist: "$assistente.emailAssist",
            			  passAssist:  "$assistente.passAssist",
            			  _idAssist:   "$assistente._id"} }
      , (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user[0] && bcrypt.compareSync(passAst, user[0].passAssist)) {
            const token = jwt.sign(user[0], env.authSecret, {
                expiresIn: "1 day"
            })
            if ( Date(user[0].validade) < new Date()){
              const vencido = true
              const _id         = user[0]._id
              const nome        = user[0].nomeAssist
              const email       = user[0].emailAssist
              const _idAssist   = user[0]._idAssist
              const medicoId    = user[0].medicoId
              const perfil      = 3
              res.json({ nome, email, _id, _idAssist, medicoId, perfil, vencido, token })
            } else{
              const vencido = false
              const _id         = user[0]._id
              const nome        = user[0].nomeAssist
              const email       = user[0].emailAssist
              const _idAssist   = user[0]._idAssist
              const medicoId    = user[0].medicoId
              const perfil      = 3
              res.json({ nome, email, _id, _idAssist, medicoId, perfil, vencido, token })
            }


        } else {
            return res.status(400).send({ errors: ['Dados inválidos'] })
        }
    })
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''
    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

const changeRecoveryPass = (req, res, next) => {
    const informacao = req.body || ''
    const salt = bcrypt.genSaltSync()
    const password = req.body.pass || ''
    const confirmPassword = req.body.confPass || ''
    const passwordHash = bcrypt.hashSync(password, salt)
    const recoveryStatus = req.body.recoveryStatus || ''
    const recoveryDate = req.body.recoveryDt || ''
    const recoveryPass = req.body.recoveryPass || ''

    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    } else if (!password.match(passwordRegex)) {
        return res.status(400).send({
            errors: [
                "A Senha precisar conter: Uma letra maiúscula, uma letra minúscula, um número, uma caractere especial entre:@#$% e tamanho de 6 a 12 caracteres."
            ]
        })
    } else{
      // console.log(recoveryPass, recoveryStatus, recoveryDate)
        User.findOneAndUpdate( { recoveryPass, recoveryStatus, recoveryDt: { $lt: recoveryDate } },
                               { $set: { password: passwordHash, recoveryPass: null, recoveryDt: null, recoveryStatus: false } },
                                (err, user) => {
                                  if (err) {
                                    return sendErrorsFromDB(res, err)
                                  } else if (user) {
                                      return res.status(200).send(['Senha alterada com sucesso!'])
                                  } else {
                                      return res.status(400).send({ errors: ['Solicitação não encontrada ou inexistente.'] })
                                  }
                              })
        }
}

const recoveryPass = (req, res, next) => {
    const email = req.body.email || ''
    const crm = req.body.crm || ''
    const dt = new Date(Date.now() + (60 * 1000)) // * 60 * 1.389 UMA HORA DE LIBERACAO
    const recoverP = Encrypt.toEncrypt(email + dt)
    User.findOneAndUpdate(
                          { email, crm },
                          { $set: { recoveryPass: recoverP, recoveryDt: dt, recoveryStatus: true } },
                          (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user){
            Recovery.sendRecovery(email, recoverP)
            return res.status(200).send(['O acesso para modificação de senha, foi encaminhada para o e-mail cadastrado.'])
        } else {
            return res.status(400).send({ errors: ['Usuário não cadastrado.'] })
        }
    })
}

const signup = (req, res, next) => {
    // Campos obrigatórios: nome, sobrenome, email, crm, celular, cep, password
    const nome = req.body.nome || ''
    const sobrenome = req.body.sobrenome || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''
    const crm = req.body.crm || ''
    const cep = req.body.cep || ''
    const celular = req.body.celular || ''
    // const medicoid = req.body.medicoid || ''
    const datNascimento = req.body.datNascimento || ''
    const tituloApresentacao = req.body.tituloApresentacao || ''
    const cidade = req.body.cidade || ''
    const estado = req.body.estado || ''
    const bairro = req.body.bairro || ''
    const endereco = req.body.endereco || ''
    const formacaoAcademica = req.body.formacaoAcademica || ''
    const posGraduacao = req.body.posGraduacao || ''
    const cursoAprimoramento = req.body.cursoAprimoramento || ''
    const artigo = req.body.artigo || ''
    const avatarPath = req.body.avatarPath || ''
    const avisoVencimento = req.body.avisoVencimento || ''
    const paginaContato = req.body.paginaContato || ''



    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informado é inválido'] })
    }

    if (!password.match(passwordRegex)) {
        return res.status(400).send({
            errors: [
                "Senha precisar conter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-12."
            ]
        })
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            // console.log(`erro 1 ${err}`)
            return sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            const newUser = new User({ nome, 
                                       sobrenome, 
                                       email, 
                                       password: passwordHash, 
                                       crm, 
                                       cep,
                                       cidade,
                                       estado,
                                       bairro,
                                       endereco, 
                                       celular, 
                                       datNascimento, 
                                       tituloApresentacao,
                                       formacaoAcademica,
                                       posGraduacao,
                                       cursoAprimoramento,
                                       artigo,
                                       avatarPath,
                                       avisoVencimento,
                                       paginaContato })
            newUser.save(err => {
                if (err) {
                    // console.log(`erro 2 ${err}`)
                    return sendErrorsFromDB(res, err)
                } else {
                    login(req, res, next)
                }
            })
        }
    })
}

module.exports = { login, loginAssist, signup, validateToken, recoveryPass, changeRecoveryPass }
