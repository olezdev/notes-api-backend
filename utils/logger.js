const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

const error = (...paramas) => {
    console.log(...paramas)
}

module.exports = {
    info,
    error
}
