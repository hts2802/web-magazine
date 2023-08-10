var sql = require("mssql/msnodesqlv8"); 

function executeSQL(strSql, cb){
    var config = {
        user: 'sa',
        password : '123456',
        server: 'LAPTOP-4L6TNGKF\\HUYNHTRONGSON',
        database: 'V2X_WEB',
        option: {
            encrypt: false,
            trustedConnection: true,
        },
    }
 sql.connect(config, function (err, db){
     if (err) console.log(err)
     var request = new sql.Request();
     request.query(strSql, function(err, recordset){
         if (err) console.log(err)
         cb(recordset);
     });
 });
}
module.exports = {
    executeSQL: executeSQL,
}