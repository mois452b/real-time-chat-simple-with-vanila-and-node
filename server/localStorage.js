import { LocalStorage } from "node-localstorage";

export class LocalStorageDatabase {
    constructor(databaseName) {
        this.localStorage = new LocalStorage('./storage');
        this.databaseName = databaseName;
        this.initializeDatabase();
    }
  
    initializeDatabase() {
        const databaseExists = this.localStorage.getItem( this.databaseName );
    
        if (!databaseExists) {
            this.localStorage.setItem( this.databaseName, JSON.stringify({}) );
        }
    }
  
    getTable(tableName) {
        const database = JSON.parse(this.localStorage.getItem(this.databaseName));
        return database[tableName] || [];
    }
  
    setTable(tableName, data) {
        const database = JSON.parse(this.localStorage.getItem(this.databaseName));
        database[tableName] = data;
        this.localStorage.setItem(this.databaseName, JSON.stringify(database));
    }
  
    insert(tableName, record) {
        const table = this.getTable(tableName);
        const id = table.length > 0 ? table[table.length - 1].id + 1 : 1;
        record.id = id;
        table.push(record);
        this.setTable(tableName, table);
        return record;
    }
  
    update(tableName, id, updatedRecord) {
        const table = this.getTable(tableName);
        const updatedTable = table.map((record) => (record.id === id ? updatedRecord : record));
        this.setTable(tableName, updatedTable);
    }
  
    delete(tableName, id) {
        const table = this.getTable(tableName);
        const updatedTable = table.filter((record) => record.id !== id);
        this.setTable(tableName, updatedTable);
    }
}
  
//   // Ejemplo de uso:
// const db = new LocalStorageDatabase('myDatabase');

// // Insertar un registro en una tabla llamada 'users'
// db.insert('users', { id: 1, name: 'John Doe', age: 25 });

// // Obtener todos los registros de la tabla 'users'
// const users = db.getTable('users');
// console.log(users);

// // Actualizar un registro en la tabla 'users'
// db.update('users', 1, { id: 1, name: 'John Doe', age: 26 });

// // // Eliminar un registro de la tabla 'users'
// db.delete('users', 1);

// // Obtener los registros actualizados
// const updatedUsers = db.getTable('users');
// console.log(updatedUsers);
  