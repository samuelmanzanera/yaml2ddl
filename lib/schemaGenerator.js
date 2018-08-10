module.exports.generateSchema = (json, { dialect }) => {
    let sql = `CREATE TABLE ${json.table} (`

    if (json.columns && Array.isArray(json.columns)) {
        sql += generateColumns(sql, json.columns, { dialect })
    }

    if (json.constraints && Array.isArray(json.constraints)) {
        sql += generateConstraints(sql, json.constraints)
    }

    sql = sql.slice(0, sql.length - 2)
    sql += ')'

    return sql
}

function generateColumns (sql, columns, { dialect }) {
    columns.forEach(col => {
        if (!col.name) {
            throw 'Table column needs a name'
        }
        if (!col.type) {
            throw 'Table column needs a type'
        }
        sql += `${col.name} ${col.type.datatype}`
        if (col.type.length) sql += ` (${col.type.length})`
        if (col.options) {
            if (col.options.notnull) sql += ` NOT NULL`
            if (col.options.default) sql += ` DEFAULT ${col.options.default}`
            if (col.options.autoincrement) {
                if (dialect === 'mysql') {
                    sql += ' AUTO_INCREMENT'
                }
                else if (dialect === 'sqlserver') {
                    sql += ' IDENTITY(1,1)'
                }
                else if (dialect === 'access' || dialect === 'sqlite') {
                    sql += ' AUTOINCREMENT'
                }
            }
        }

        sql += ', '
    })

    return sql
}

function generateConstraints (sql, constraints) {
    constraints.forEach(constraint => {
        sql += `CONSTRAINT ${constraint.name + ' ' || ''}`
        if (constraint.type === 'primary') {
            if (!constraint.columns) {
                throw 'Public key constraint needs columns to apply on'
            }
            sql += `PRIMARY KEY (${constraint.columns.join(',')})`
        }
        else if (constraint.type === 'foreign') {
            if (!constraint.columns) {
                throw 'Foreign key constraint needs columns to apply on'
            }
            if (!constraint.references) {
                throw 'Foreign key constraint needs references to apply on'
            }
            if (!constraint.references.table) {
                throw 'Foreign key constraint needs references table to apply on'
            }
            if (!constraint.references.column) {
                throw 'Foreign key constraint needs references column to apply on'
            }
            sql += `FOREIGN KEY (${constraint.columns.join(',')}) REFERENCES ${constraint.references.table}(${constraint.references.column})`
        }
        else if (constraint.type === 'unique') {
            if (!constraint.columns) {
                throw 'Unique constraint needs columns to apply on'
            }
            sql += `UNIQUE (${constraint.columns.join(',')})`
        }
        else if (constraint.type === 'check') {
            if (!constraint.condition) {
                throw 'Check constraint needs a condition'
            }
            sql += `CHECK (${constraint.condition})`
        }
        sql += ', '
    })

    return sql
}

