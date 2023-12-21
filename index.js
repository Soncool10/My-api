const express = require('express');
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 3000;

//Middleware - Plugin

app.use(express.urlencoded({ extended: false}));

//Html view

app.get('/users',(req, res) => {
    const html = `USERS LIST
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

//Rest API

//GET, PATCH and DELETE
app.get('/api/users',(req, res) => {
    return res.json(users);
});

app.route("/api/users/:id")
.get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if(!user){
        return res.status(404).json({
            status:'Error',
            message:'No details with id ' + id +' is found'
        })
    }
    return res.json(user);
})
.patch((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    const body = req.body;

    if(!user){
        return res.status(404).json({
            status:'Error',
            message:'No details with id ' + id +' is found'
        })
    }

    const index = users.indexOf(user);

    Object.assign(user, body);

    users[index] = user;

   fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(200).json({status:"Success", message:'Update Succesful', data: {
            Details: user
        }});
    });
})
.delete((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    if(!user){
        return res.status(404).json({
            status:'Error',
            message:'No details with id ' + id +' is found'
        })
    }
    const index = users.indexOf(user);

    users.splice(index, 1);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(200).json({status:"Success", message:'Deletion Succesful'});
    });
});

//POST
app.post('/api/users', (req,res) => {
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status:"Success", id: users.length});
    });
});


//PORT
app.listen(PORT, () => {
    console.log(`Server Started At PORT:${PORT}`);
});