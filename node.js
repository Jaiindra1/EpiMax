const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const bcrypt = require("bcrypt");
const dbPath = path.join(__dirname, "sqlite.db");
const jwt = require("jsonwebtoken");

app.use(express.json());

let db = null;
let jwtToken = null;
let loginStatus = null;
let userName = null;
let hallticket_number = userName;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Login First");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};
app.get('/', async(request,response) => {
  response.sendFile("/index.html",{root : __dirname});
});
app.get('/signup', async(request,response)=>{
  response.sendFile(__dirname + "/signup.html")
});
app.get('/Homepage',authenticateToken, async(request,response) => {
    response.sendFile(__dirname + '/Homepage.html');
});

app.post('/login/user',async(request,response) =>{
  const {name,password} = request.body;
  userName = name;
  const selectUserQuery = `SELECT * FROM users ;`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
    loginStatus = "failed";
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      loginStatus = "success"
      const payload = {
        username: name,
      };
       jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      let Loginarray = ["Login success !",jwtToken]
      response.json(Loginarray);
      console.log("login success",name);
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});
app.post('/signup/userdetails',async(request,response)=>{
  const {name,password} = request.body;
  const hasedPassword =  await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `select * from users where name='${name}';`;
  const dbuser = await db.get(selectUserQuery);
  if (dbuser === undefined) {
    const q = `insert into users (name,password) 
    values('${name}','${hasedPassword}');`;
    const dbResponse = await db.run(q);
  response.sendFile(__dirname + "/index.html");
  console.log("created");
  }
  else {
    response.status = 400;
    response.json("user lready exists " + `${name}`);
    console.log("user exits");
  }
});
  /* REQUEST
 let data = {
  "name": "name",
  "password": "password"
      }
 let option = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
           },
          body: JSON.stringify(data)
      };
      fetch('/login/user', option)
      .then(function(response) {
    return response.json();
  })
  .then(function(jsonData) {
    console.log(jsonData);
  });
*/
app.post('/login/user',async(request,response) =>{
  const {name,password} = request.body;
  userName = name;
  const selectUserQuery = `SELECT * FROM Users ;`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
    loginStatus = "failed";
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      loginStatus = "success"
      const payload = {
        username: name,
      };
       jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      let Loginarray = ["Login success !",jwtToken]
      response.json(Loginarray);
      console.log("login success",name);
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});
/* REQUEST
let data = {
"name": "name",
"password": "password"
    }
let option = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
         },
        body: JSON.stringify(data)
    };
    fetch('/signup/userdetails', option)
    .then(function(response) {
  return response.json();
})
.then(function(jsonData) {
  console.log(jsonData);
});
*/

app.post('/signup/userdetails',async(request,response)=>{
  const {name,password} = request.body;
  const hasedPassword =  await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `select * from Users where name='${name}';`;
  const dbuser = await db.get(selectUserQuery);
  if (dbuser === undefined) {
    const qs = `insert into Users (name,password) 
    values('${name}','${hasedPassword}');`;
    const dbResponse = await db.run(qs);
  response.sendFile(__dirname + "/index.html");
  console.log("created");
  }
  else {
    response.status = 400;
    response.json("user lready exists " + `${name}`);
    console.log("user exits");
  }
});

// POST - Create a new task

/* REQUEST
let data = {
"title": "Task title",
"description": "Task description",
"assignee_id":"1",
"status": "Pending",
"created_at": "YYYY-MM-DDTHH:MM:SSZ",
"updated_at": "YYYY-MM-DDTHH:MM:SSZ"
}
let option = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization : accessToken
         },
        body: JSON.stringify(data)
    };
    fetch('/tasks', option)
    .then(function(response) {
  return response.json();
})
.then(function(jsonData) {
  console.log(jsonData);
});
*/

app.post('/tasks',authenticateToken, async(request,response) => {
  const {title,description,status} = request.body;
  const query = `INSERT INTO tasks (title,description,status) VALUES ('${title}','${description}','${status}')`;
  const run = await db.run(query);
  response.sendStatus(200);
});

// GET /tasks - Retrieve all tasks

/*REQUEST
let option = {
  method: "GET",
  headers: {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization : accessToken
   },
};
*/

app.get('/tasks',authenticateToken, async(request,response) => {
  const Retrive = "select * from tasks";
  const data =await  db.all(Retrive);
  response.json(data);
});

//GET /tasks/:id - Retrieve a specific task by ID

/*REQUEST
let option = {
  method: "GET",
  headers: {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization : accessToken
   },
};
fetch('/tasks/1', option)
*/

app.get('/tasks/:taskId/',authenticateToken, async (request, response) => {
  const { taskId } = request.params;
  const getTaskQuery = `
    SELECT
      *
    FROM
      tasks
    WHERE
      task_id = ${taskId};`;
  const task = await db.get(getTaskQuery);
  response.json(task);
});

//PUT /tasks/:id - Update a specific task by ID
/*REQUEST
let data = {
"title": "Updated task title",
"assignee_id":"1",
"description": "Updated task description",
"status": "Completed",
"created_at": "YYYY-MM-DDTHH:MM:SSZ",
"updated_at": "YYYY-MM-DDTHH:MM:SSZ"
}
let option = {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization : accessToken
         },
        body: JSON.stringify(data)
    };
    fetch('/tasks/2', option)
    .then(function(response) {
  return response.json();
})
.then(function(jsonData) {
  console.log(jsonData);
});
*/

app.put('tasks/:taskid',authenticateToken, async(request,response) =>{
  const {taskid}=request.params;
  const {title, description, status, assignee_id, created_at, updated_at} = request.body;
  const querytext = 'UPDATE tasks SET title = ${title}, description = ${description}, status = ${status}, assignee_id = ${assignee_id}, createdat = ${created_at}, updatedat = ${updated_at} where id = ${taskid}';
  const taskquery = await db.run(querytext);
  response.status(200);
});

//- DELETE `/tasks/:id` - Delete a specific task by ID
/*REQUEST
let option = {
  method: "DELETE",
  headers: {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization : accessToken
   },
};
fetch('/tasks/4', option)
*/
app.delete('/tasks/:id',authenticateToken,async(request, response) => {
  const {id} = request.params;
  const deletequery = 'DELETE FROM tasks WHERE id = ${id}';
  const run = await db.run(deletequery);
  response.status(204)
})
