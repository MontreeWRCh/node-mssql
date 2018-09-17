var express = require('express');
var bodyParser = require('body-parser')

var Sequelize = require('sequelize');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

// Create connection to database
var config = {
  userName: 'sa', // update me
  password: '12345', // update me
  server: '192.168.92.130',
  options: {
    database: 'User_vjg'
  }
}

var connection = new Connection(config);

function Start(callback) {
    console.log('Starting...');
    callback(null, 'Jake', 'United States');
}

function Insert(userid,userCode,name, deptid, cardNum,callback) {
    console.log("Inserting '" + name + "' into Table...");

    request = new Request(
        'INSERT INTO dbo.Userinfo ( Userid, UserCode, Name, Deptid, CardNum) VALUES ( @Userid, @UserCode, @Name, @Deptid, @CardNum);',
        function(err, rowCount, rows) {
        if (err) {
            callback(err);
        } else {
            console.log(rowCount + ' row(s) inserted');
            callback(null, 'Nikita', 'United States');
        }
        });
    request.addParameter('Userid', TYPES.NVarChar, userid);
    request.addParameter('UserCode', TYPES.NVarChar, userCode);
    request.addParameter('Name', TYPES.NVarChar, name);
    request.addParameter('Deptid', TYPES.NVarChar, deptid);
    request.addParameter('CardNum', TYPES.NVarChar, cardNum);

    // Execute SQL statement
    connection.execSql(request);
}

function Update(name, location, callback) {
    console.log("Updating Location to '" + location + "' for '" + name + "'...");

    // Update the employee record requested
    request = new Request(
    'UPDATE TestSchema.Employees SET Location=@Location WHERE Name = @Name;',
    function(err, rowCount, rows) {
        if (err) {
        callback(err);
        } else {
        console.log(rowCount + ' row(s) updated');
        callback(null, 'Jared');
        }
    });
    request.addParameter('Name', TYPES.NVarChar, name);
    request.addParameter('Location', TYPES.NVarChar, location);

    // Execute SQL statement
    connection.execSql(request);
}

function Delete(name, callback) {
    console.log("Deleting '" + name + "' from Table...");

    // Delete the employee record requested
    request = new Request(
        'DELETE FROM TestSchema.Employees WHERE Name = @Name;',
        function(err, rowCount, rows) {
        if (err) {
            callback(err);
        } else {
            console.log(rowCount + ' row(s) deleted');
            callback(null);
        }
        });
    request.addParameter('Name', TYPES.NVarChar, name);

    // Execute SQL statement
    connection.execSql(request);
}

function Read(callback) {
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request('SELECT Id, Name, Location FROM TestSchema.Employees;',
        (err, rowCount, rows) => {
            if (err) {
                callback(err);
            } else {
                console.log(rowCount + ' row(s) returned');
                callback(null);
            }
        }
    );

    // Print the rows read
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
}

function Complete(err, result) {
    if (err) {
        callback(err);
    } else {
        console.log("Done!");
    }
}


let app = express();
app.use(bodyParser());

app.get('/',(req,res)=>{
    da();
    res.send('Connected');
})

app.get('/users',(req,res)=>{
    Read((data)=>{
        res.send(data);
    });
})

app.post('/newusers',(req,res)=>{
    let user = req.body;
    console.log(user);

    Insert( user.userid, user.userCode, user.name, user.deptid, user.cardNum,(data)=>{
        res.send(data);
    });
})

app.get('/updateusers',(req,res)=>{
    Update("Test","baroooo",(data)=>{
        res.send(data);
    });
})


app.listen(3000, ()=>console.log('Running on localhost:3000'));