const _ = require('lodash')
const Fila = require('./fila')
const ObjectId = require('mongoose').Types.ObjectId

function getFila(req, res, next) {
    //  console.log(req.params.periodo, req.params.medico)

    if (req.params.periodo && !req.params.periodo === "undefined") {

        var dt = new Date(req.params.periodo)
        // console.log('perido 1:', dt)
        var d = parseInt(dt.getUTCDate())
        var m = parseInt(dt.getUTCMonth() + 1)
        var y = parseInt(dt.getFullYear())

    } else if (req.params.periodo === "undefined") {
        var dt2 = new Date()
        // console.log('perido 2:', dt2)
        var d = parseInt(dt2.getUTCDate())
        var m = parseInt(dt2.getUTCMonth() + 1)
        var y = parseInt(dt2.getFullYear())
    } else {
        var dt3 = new Date(req.params.periodo)
        // console.log('perido 3:', dt3)
        var d = parseInt(dt3.getUTCDate())
        var m = parseInt(dt3.getUTCMonth() + 1)
        var y = parseInt(dt3.getFullYear())
    }

    // console.log('Dia:',d,' Mes:', m, 'Ano:',y)

    Fila.aggregate(
        { $match: { medicoId: new ObjectId(req.params.medico) } },
        {
            $project: {
                ano: { $year: "$dataFila" },
                mes: { $month: "$dataFila" },
                dia: { $dayOfMonth: "$dataFila" },
                medicoId: "$medicoId",
                pacienteId: "$pacienteId",
                nome: { $concat: ["$nome", " ", "$sobrenome"] },
                atendido: "$atendido",
                perm: {
                    $switch: {
                        branches: [
                            { case: { $eq: [true, "$atendido"] }, then: "Atendido" },
                            { case: { $eq: [false, "$atendido"] }, then: "Aguardando" }
                        ], default: "Aguardando"
                    }
                }
            }
        },
        { $match: { ano: y, mes: m, dia: d } }
        , function (error, resp) {
            if (error) {
                res.status(500).json({ errors: [error] })
            } else {
                res.json(resp)
            }
        })
}

function getQtdFila(req, res, next) {
    var dt4 = new Date(req.params.periodo)
    var d = parseInt(dt4.getUTCDate())
    var m = parseInt(dt4.getUTCMonth() + 1)
    var y = parseInt(dt4.getFullYear())

    Fila.aggregate(
        { $match: { medicoId: new ObjectId(req.params.medico),
                    pacienteId: new ObjectId(req.params.paciente)}
        },
        {
            $project: {
                ano: { $year: "$dataFila" },
                mes: { $month: "$dataFila" },
                dia: { $dayOfMonth: "$dataFila" }
            }
        },
        { $match: { ano: y, mes: m, dia: d }},
        { $count: "value" }
        , function (error, resp) {
            if (error) {
                res.status(500).json({ errors: [error] })
            }
             else {
                res.json(resp[0])
            }

        })
}

module.exports = { getFila, getQtdFila }