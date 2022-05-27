const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info(request.method)
    logger.info(request.path)
    logger.info(request.body)
    logger.info('-----')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    } else if (error.name === 'JsonWebTokenError') {
        logger.info('token is missing')
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    logger.error(error.message)
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}