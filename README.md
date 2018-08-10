# yaml2ddl

[![npm version](https://badge.fury.io/js/yaml2ddl.svg)](https://badge.fury.io/js/yaml2ddl)

Generate a DDL schema from yaml description

#### Support
- For SQL database
  - Auto increment handled for MySQL, SQL Server, SQLITE, Access
- Soon support for MongoDB

### Installation
```sh
npm install yaml2ddl
```

#### Usage
```js
const yaml2dll = require('yaml2dll')

const schemaFileUri = './user.table.yaml'

// With promise
yaml.generate(schemaFileUri)
  .then()
  .catch()


//With async/await 
try {
    const sqlGeneratedFromFile = await yaml.generate(schemaFileUri)
}
catch (e) {

}
```

### Schema example

```yaml
table: user
constraints:
    - columns: 
        - id
      name: PK_User
      type: primary
columns:
    - name: id
        type: #
        datatype: int
        options:
            notnull: true
            autoincrement: true
    - name: email
        type: 
        datatype: varchar
        length: 100
```

### Licence
MIT
