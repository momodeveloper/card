const express = require('express');

const app = express();

const fs = require('fs');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get("/api/cards", (req, res, next) => {
    try {
        if (!fs.existsSync("./data.json")) {
            res.status(200).json({ "cards": [] });
        }
        else {
            var data = require("./data.json");
            res.status(200).json(data);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "une erreur s'est produite" });
    }
});

app.post("/api/cards", (req, res, next) => {
    try {
        if (!fs.existsSync("./data.json")) {
            var initialJsonValue = { "cards": [] };
            initialJsonValue.cards.push({
                "id": "1",
                ...req.body
            });
            initialJsonValue = JSON.stringify(initialJsonValue);
            fs.writeFile("./data.json", initialJsonValue, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "une erreur s'est produite" });
                } else {
                    res.status(200).json(JSON.parse(initialJsonValue));
                }
            })
        } else {
            var data = require("./data.json");
            var newId = data.cards.length ? (parseInt(data.cards[data.cards.length - 1].id) + 1) : 1;
            newId = newId.toString();
            data.cards.push({
                "id": newId,
                ...req.body
            });
            var dataJson = JSON.stringify(data);
            fs.writeFile('./data.json', dataJson, 'utf8', (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "une erreur s'est produite" });
                } else {
                    res.status(200).json(data);
                }
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "une erreur s'est produite" });
    }
});

app.delete("/api/cards/:id", (req, res, next) => {
    try {
        if (!fs.existsSync("./data.json")) {
            res.status(200).json({ message: "il n'existe pas de données" });
        } else {
            var data = require("./data.json");
            var elementExists = false;
            for (var [i, card] of data.cards.entries()) {
                if (card.id == req.params.id) {
                    data.cards.splice(i, 1);
                    elementExists = true;
                    break;
                }
            }
            if (!elementExists)
                res.status(200).json({ message: "l'élément sélectionné n'existe pas" });
            else {
                var dataJson = JSON.stringify(data);
                fs.writeFile('./data.json', dataJson, 'utf8', (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "une erreur s'est produite" });
                    } else {
                        res.status(200).json(data);
                    }
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "une erreur s'est produite" });
    }
});


module.exports = app;