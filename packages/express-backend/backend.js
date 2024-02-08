// backend.js

import express from "express";
import cors from "cors";
import services from "./models/users-services.js";
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job != undefined) {
        let response = services.getUsers(name, job);
        console.log(response);
        response.then((users) => {
            if (users) {
                response = { users_list: users };
                res.status(200).send(response);
            } else {
                res.status(404).send("Resource not found.");
            }
        }).catch((error) => {
            res.status(404).send("Resource not found.");
        })
    } else if (name != undefined) {
        let response = services.getUsers(name, null);
        response.then((users) => {
            if (users) {
                response = { users_list: users };
                res.status(200).send(response);
            } else {
                res.status(404).send("Resource not found.");
            }
        }).catch((error) => {
            res.status(404).send("Resource not found.");
        })
    } else if (job != undefined) {
        let response = services.getUsers(null, job);
        response.then((users) => {
            if (users) {
                response = { users_list: users };
                res.status(200).send(response);
            } else {
                res.status(404).send("Resource not found.");
            }
        }).catch((error) => {
            res.status(404).send("Resource not found.");
        })
    } else {
        let response = services.getUsers();
        response.then((users) => {
            if (users) {
                response = { users_list: users };
                res.status(200).send(response);
            } else {
                response = { users_list: [] };
            }
        }).catch((error) => {
            console.log(error);
            res.status(404).send("Resource not found.");
        })
    }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = services.findUserById(id);
    result.then((result) => {
        if (result) {
            res.send(result)
        } else {
            res.status(404).send("Resource not found.");
        }
    }).catch((error) => {
        res.status(404).send("Resrouce not found.");
    });
});


app.post("/users", (req, res) => {
    const userToAdd = req.body;
    const newUser = services.addUser(userToAdd);
    newUser.then((result) => {
        res.status(201).send(result);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.delete("/users", (req, res) => {
    const id = req.body._id;
    let response = services.deleteUser(id);
    response.then((result) => {
        if (result) {
            res.status(204).send("User deleted.");
        } else {
            res.status(404).send("Resource not found.");
        }
    }).catch((error) => {
        res.status(404).send("Resource not found.");
    });
});
