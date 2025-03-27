import { Performance } from '../models/models.js'

// SOLUCION-> copiar el create de algun otro modelo
const create = async function (req, res) {
    // TO-DO: here's the controller code for create a new performance
    const newPerformance = Performance.build(req.body)
    try {
        const performance = await newPerformance.save()
        res.json(performance)
    } catch (err) {
        res.status(500).send(err)
    }
}

const PerformanceController = {create}

export default PerformanceController