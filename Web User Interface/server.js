//=======THIS WHERE FUNTIONS ARE BEING CALLED=======

// Create express app
var express = require("express")
const University = require("./universities")
var app = express()

const CHelper = require('./universities')
var universities = new CHelper('./data.sqlite')

// Server port
var HTTP_PORT = 8092

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// Insert here other API endpoints

app.get("/UniversityName", (req, res, next) => {
    universities.allUniversities()   
        .then((UniversityName) => {
            res.json({
                "message": "success",
                "data": UniversityName
            })
        })
        .catch((err) => {
            res.status(400).json({ "error": err.message });
            return;
        })
});

app.get("/api/state", (req, res, next) => {
    universities.allStates()
        .then((StateName) => {
            res.json({
                "message": "success",
                "data": StateName
            })
        })
        .catch((err) => {
            res.status(400).json({ "error": err.message });
            return;
        })    
});

app.get("/api/schoolType", (req, res, next) => { //
    universities.allSchoolTypes() //
        .then((TypeName) => { //
            res.json({
                "message": "success",
                "data": TypeName //
            })
        })
        .catch((err) => {
            res.status(400).json({ "error": err.message });
            return;
        })    
});

//====this is for list majors=====
app.get("/MajorandLevel/:UniversityName", (req, res, next) => {
    if (req.params.UniversityName != "------- Select --------") {
        universities.MajorForaUni(req.params.UniversityName)
            .then((major) => {
                res.json({
                    "message": `major by ${req.params.UniversityName}`,
                    "data": major
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});

//=======this is for total population, show population
app.get("/Pop/:UniversityName", (req, res, next) => {
    if (req.params.UniversityName != "------- Select --------") {
        universities.PopForaUni(req.params.UniversityName)
            .then((pop) => {
                res.json({
                    "message": `major by ${req.params.UniversityName}`,
                    "data": pop
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});
//=======this is for cost, estimate cost
app.get("/Cost/:UniversityName", (req, res, next) => {
    if (req.params.UniversityName != "------- Select --------") {
        universities.CostForaUni(req.params.UniversityName)
            .then((cost) => {
                res.json({
                    "message": `major by ${req.params.UniversityName}`,
                    "data": cost
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});
//======this is for ranking=== view ranking
app.get("/Ranking/:UniversityName", (req, res, next) => {
    if (req.params.UniversityName != "------- Select --------") {
        universities.RankingForaUni(req.params.UniversityName)
            .then((rank) => {
                res.json({
                    "message": `major by ${req.params.UniversityName}`,
                    "data": rank
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});

app.get("/Score/:UniversityName", (req, res, next) => {
    if (req.params.UniversityName != "------- Select --------") {
        universities.ScoreForaUni(req.params.UniversityName)
            .then((score) => {
                res.json({
                    "message": `score of ${req.params.UniversityName}`,
                    "data": score
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});

app.get("/Race/:UniversityName", (req, res, next) => {
    if (req.params.UniversityName != "------- Select --------") {
        universities.RaceForaUni(req.params.UniversityName)
            .then((race) => {
                res.json({
                    "message": `score of ${req.params.UniversityName}`,
                    "data": race
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});

app.get("/Income/:UniversityName", (req, res, next) => {
    if (req.params.UniversityName != "------- Select --------") {
        universities.IncomeForaUni(req.params.UniversityName)
            .then((income) => {
                res.json({
                    "message": `income of ${req.params.UniversityName}`,
                    "data": income
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});


app.get("/api/CostBaseOnLocationType/:states-:type", (req, res, next) => {
    if (req.params.state != "------- Select --------") {
        universities.CostBaseOnLocationType(req.params.states, req.params.type)
            .then((cost) => {
                res.json({
                    "message": `${req.params.states} by ${req.params.type}`,
                    "data": cost
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});

app.get("/api/CostEarning/:states-:tuitionCost-:startEarning", (req, res, next) => { //
    if (req.params.states == "All") { //params.name follow what's in the URL above exactly
        universities.allCostEarning(req.params.tuitionCost, req.params.startEarning) //
            .then((costEarning) => {
                res.json({
                    "message": `${req.params.tuitionCost} by ${req.params.startEarning}`, //
                    "data": costEarning
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
    else{
        universities.StateCostEarning(req.params.states, req.params.tuitionCost, req.params.startEarning) //
            .then((costEarning) => {
                res.json({
                    "message": `${req.params.states} by ${req.params.tuitionCost} by ${req.params.startEarning}`, //
                    "data": costEarning
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }
});

//display spcific major for the choosing university
app.get("/api/spcificMajor/:general-:university", (req, res, next) => { //   
    if (req.params.general != "------- Select --------" && req.params.university != "------- Select --------") {
        universities.displaySpecificMajor(req.params.general, req.params.university) //
            .then((major) => {
                res.json({
                    "message": `${req.params.general} by ${req.params.university}`, //
                    "data": major
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }    
});

//populate general major
app.get("/api/generalMajor", (req, res, next) => { //
    universities.allGeneralMajor() //
        .then((generalName) => { //
            res.json({
                "message": "success",
                "data": generalName //
            })
        })
        .catch((err) => {
            res.status(400).json({ "error": err.message });
            return;
        })    
});

//contain all university and their score that offer the genral major user choose
app.get("/api/University/:general", (req, res, next) => { //   
    if (req.params.general != "------- Select --------") {
        universities.allUniGeneralMajor(req.params.general)
            .then((university) => {
                res.json({
                    "message": `general by ${req.params.general}`,
                    "data": university
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }    
});

//contain all university name that offer the genral major user choose
app.get("/api/University/spcificMajor/:general", (req, res, next) => { //   
    if (req.params.general != "------- Select --------") {
        universities.allUniGeneral(req.params.general)
            .then((university) => {
                res.json({
                    "message": `general by ${req.params.general}`,
                    "data": university
                })
            })
            .catch((err) => {
                res.status(400).json({ "error": err.message });
                return;
            })
    }    
});

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});