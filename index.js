const fs = require('fs')
const yaml = require('js-yaml')
const schemaGenerator = require('./lib')

module.exports.generateFromFile = (fileUri, { dialect } = {}) => {
    return new Promise((resolve, reject) => {
        if (!fileUri) {
            return reject('File uri is required')
        }
        
        fs.readFile(fileUri, 'utf8', (err, yamlSchema) => {
            if (err) {
                return reject(err)
            }

            const sql = schemaGenerator.generateSchema(yaml.safeLoad(yamlSchema), { dialect })
            resolve(sql)
        })
    })
}

module.exports.generate = (yamlSchema, { dialect } = {}) => {
    const sql = schemaGenerator.generateSchema(yaml.safeLoad(yamlSchema), { dialect })
    return sql
}