const mysql = require("promise-mysql");

async function query(sql) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "wayou",
    password: "123",
    database: "todo"
  });
  try {
    const result = connection.query(sql);
    connection.end();
    return result;
  } catch (error) {
    throw error;
  }
}

async function getTodoById(id) {
  const result = await query(`select * from todo where todo.id='${id}'`);
  if (result[0]) {
    return result[0];
  }
  return null;
}

async function getAll() {
  return await query("select * from todo");
}

async function remove(id) {
  return await query(`delete from todo where todo.id='${id}'`);
}

async function update(todo) {
  todo.is_done = todo.is_done == undefined ? 0 : todo.is_done;

  if (todo.id) {
    Object.assign(getTodoById(todo.id), todo);
    return await query(`
    update todo
    set content='${todo.content}',is_done='${todo.is_done}'
    where todo.id=${todo.id}
    `);
  } else {
    todo.date = new Date().toJSON().slice(0, 10);
    return await query(`
    insert into todo (content,date,is_done) 
    values ('${todo.content}','${todo.date}','${todo.is_done}')
    `);
  }
}

module.exports = {
  getTodoById,
  getAll,
  remove,
  update
};
