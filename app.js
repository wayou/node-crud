const Koa = require("koa");
const views = require("koa-views");
const _ = require("koa-route");
const db = require("./db");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
app.use(bodyParser());

// 配置模板路径及所使用的模板引擎
app.use(
  views(__dirname + "/views", {
    map: {
      html: "nunjucks"
    }
  })
);

app.use(
  _.get("/", async function(ctx) {
    const todos = await db.getAll();
    await ctx.render("list", {
      list: todos
    });
  })
);

app.use(
  _.get("/add", async function(ctx) {
    await ctx.render("form", { todo: {} });
  })
);

app.use(
  _.get("/edit", async function(ctx) {
    const id = ctx.query.id;
    if (!id) {
      throw new Error("id is missing");
    }
    const todo = await db.getTodoById(id);
    if (!todo) {
      ctx.body = "item not found!";
    } else {
      await ctx.render("form", {
        todo
      });
    }
  })
);

app.use(
  _.post("/edit", async function(ctx) {
    try {
      const todo = ctx.request.body;
      await db.update(todo);
      ctx.redirect("/");
    } catch (error) {
      ctx.body = error.stack;
    }
  })
);

app.use(
  _.post("/remove", async function(ctx) {
    const id = ctx.request.body.id;
    try {
      console.log(`remove entry ${id}`);
      await db.remove(id);
      ctx.body = {
        status: 0,
        error_message: ""
      };
    } catch (error) {
      ctx.body = error.stack;
    }
  })
);

app.listen(3000);
console.log("server started at http://localhost:3000");
