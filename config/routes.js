const express = require('express')
const auth = require('./auth')


module.exports = function (server) {

    /*
     * Rotas abertas
     */
    const openApi = express.Router()
    server.use('/oapi', openApi)

    const AuthService = require('../api/user/authService')
    const SendFile = require('../api/uploadFile/sendFile')
    const Cep = require('../api/cep/cepFilter')

    openApi.post('/login', AuthService.login)
    openApi.post('/loginAssist', AuthService.loginAssist)
    openApi.post('/recoveryPass', AuthService.recoveryPass)
    openApi.post('/signup', AuthService.signup)
    openApi.post('/validateToken', AuthService.validateToken)
    openApi.post('/changeRecoveryPass', AuthService.changeRecoveryPass)
    openApi.post('/sendImage', SendFile.sendFile)
    openApi.route('/ceps/:codCep').get(Cep.getCep)
    openApi.get('/slgUf', Cep.getSlgUf)

    /*
     * Rotas protegidas por Token JWT
     */
    const protectedApi = express.Router()
    server.use('/api', protectedApi)

	protectedApi.use(auth)


    const billingCycleService = require('../api/billingCycle/billingCycleService')
    billingCycleService.register(protectedApi, '/billingCycles')

    const userService = require('../api/user/userService')
    userService.register(protectedApi, '/users')

    const userFilter = require('../api/user/userFilter')
    protectedApi.route('/user/:id').get(userFilter.getUserById)

    const billingSummaryService = require('../api/billingSummary/billingSummaryService')

    protectedApi.route('/billingSummary/:medico').get(billingSummaryService.getSummary)

    const billingFilter = require('../api/billingCycle/billingCycleFilter')

    protectedApi.route('/billingFilter/count/:medico').get(billingFilter.getCountByMedic)
    protectedApi.route('/billingFilter/medico/:medico').get(billingFilter.getListByMedic)

    // Cadastro de Pacientes e Consultas
    const cadastroPacienteService = require('../api/cadastroPaciente/cadastroPacienteService')
    cadastroPacienteService.register(protectedApi, '/cadastroPaciente')

    const pacienteFilter = require('../api/cadastroPaciente/cadastroPacienteFilter')
    protectedApi.route('/cadastroPacientes/:medico/:limit/:skip').get(pacienteFilter.getPacienteByMedicoId)
    protectedApi.route('/cadastroPacientes/:medico/:limit/:skip/:nome/:sobrenome').get(pacienteFilter.getPacienteByMedicoId)
    protectedApi.route('/cadastroPacientesQtd/:medico').get(pacienteFilter.getQtdByMedicoId)
    protectedApi.route('/cadastroPacientesQtd/:medico/:nome/:sobrenome').get(pacienteFilter.getQtdByMedicoId)

    // Fila de atendimento
    const filaService = require('../api/fila/filaService')
    filaService.register(protectedApi, '/fila')

    const filaFilter = require('../api/fila/filaFilter')
    protectedApi.route('/filaDia/:medico/:periodo').get(filaFilter.getFila)
    protectedApi.route('/filaQtd/:medico/:paciente/:periodo').get(filaFilter.getQtdFila)

    // Renovacao
    const renovacaoService = require('../api/renovacao/renovacaoService')
    renovacaoService.register(protectedApi, '/renovacao')

    // Produto
    const produtoService = require('../api/produto/produtoService')
    produtoService.register(protectedApi, '/produto')

    //Contato
    const contatoService = require('../api/contato/contatoService')
    protectedApi.route('/contato').post(contatoService.sendCustumerEmail)
}
