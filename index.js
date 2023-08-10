const bodyParser = require('body-parser');
var express = require('express');                  
var sql1 = require("./Sql");
var sql2 = require("./Sql");
var sql3 = require("./Sql");
const Shoppingcard = require("./shoppingcard")
const path = require('path');   
var app = express();
var sql = require("mssql/msnodesqlv8"); 
const { Console } = require('console');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(5900,function(){
    console.log('Sever is loading...');                     
});

app.use(express.static(__dirname +'/public'));
app.get('/test',(req,res,next)=>{
    res.sendFile(__dirname + "/index.html")});
app.get('/art',(req,res,next)=>{
    res.sendFile(__dirname + "/List_Art/Art.html")}); 
app.get('/culture',(req,res,next)=>{
    res.sendFile(__dirname + "/List_Culture/Culture.html")}); 
app.get('/fashion',(req,res,next)=>{
    res.sendFile(__dirname + "/List_Fashion/Fashion.html")}); 
app.get('/music1',(req,res,next)=>{
    res.sendFile(__dirname + "/List_Music/music.html")}); 
app.get('/timkiem',(req,res,next)=>{
        res.sendFile(__dirname + "/List_Music/SE.html")}); 
app.get('/people',(req,res,next)=>{
    res.sendFile(__dirname + "/List_People/People.html")}); 
app.get('/contact',(req,res,next)=>{
    res.sendFile(__dirname + "/List_Contact/Contact.html")}); 
//ĐĂNG NHẬP
///ADMIN
///STAFF
app.get('/admin',(_req,res,next)=>{
    res.sendFile(__dirname + "/MayChu/Admin.html")}); 
app.get('/adminmc',(_req,res,next)=>{
    res.sendFile(__dirname + "/MayChu/AdminMC.html")}); 
    
function Admin (username, password, cb) {
    sql1.executeSQL(`select * From ADMIN_MC where TaiKhoan = '${username}' and MatKhau = '${password}'`, (recordset) => {
        console.log(recordset)
        var user = recordset.recordset[0];
        cb(user)
    });
}
app.post('/getadmin', (req, res) => {
    console.log(req.body)
    Admin(req.body.username, req.body.password, (user) => {
        console.log("Complete the Admin Login", user)
        res.send(user);
    })
})
///GUESS
app.get('/KH',(_req,res,next)=>{
    res.sendFile(__dirname + "/DangNhap/Login.html")}); 
    
function Guess (username, password, cb) {
    sql2.executeSQL(`select * From GUESS_TK where TaiKhoan = '${username}' and MatKhau = '${password}'`, (recordset) => {
        console.log(recordset)
        var user = recordset.recordset[0];
        cb(user)
    });
}
app.post('/getguess', (req, res) => {
    console.log(req.body)
    Guess(req.body.username, req.body.password, (user) => {
        console.log("Complete the Login", user)
        res.send(user);
    })
})
//ĐĂNG KÍ
app.get('/regester',(req,res,next)=>{
    res.sendFile(__dirname + "/DangKi/Regester.html")});

function getRegester(TaiKhoan, MatKhau, cb) {
  sql3.executeSQL(
    `insert into GUESS_TK values('${TaiKhoan}', '${MatKhau}')`, (recordset) => {
        console.log(recordset)
      cb(recordset);
    }
  );
}
app.post('/getRegester', function (req, res) {
    console.log(req.body.TaiKhoan)
    console.log(req.body.MatKhau)
    getRegester(req.body.TaiKhoan, req.body.MatKhau, (user) => {
        console.log("Complete the Sign-up", user)
        res.sendFile(__dirname+'/DangNhap/Login.html')
    
    });
});
//MUSIC
app.get('/SQL', function (req, res){
    var config = {
        user: 'sa',
        password : '123456',
        server: 'LAPTOP-4L6TNGKF\\HUYNHTRONGSON',
        database: 'V2X_WEB',
        option: {
            encrypt: false,
            trustedConnection: true,
        },
    };
    sql.connect(config, function(err,db){
        console.log(db);
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(`select * from SANPHAM`, function (err,recordset){
            if(err) console.log(err)

            var result = "";

            recordset.recordsets[0].forEach(rows => {
                result +=` 
                <div class="card body-similar-card" style="display:inline;height:100%;width:450px;float:left;margin-left: 30px">
                <a href="/chitiet/${rows['MaSP']}"><img 
                style="
                width:450px; height:100%;
                border: 20px solid #ccc;
                box-shadow: 2px 2px 0.5px #ccc;
                background: rgba(128, 128, 255, 0.2);"
                src='../imageMusic/${rows['Filesp']}'/></a>
                       
                       <div class="card-body">
                           <p class="card-text body-similar-cart-price"><span style="color:black;font-weight: bold">${rows['GiaBan']}</span></p>
                         <h5 class="card-title body-similar-cart-tittle"><a herf="/chitiet/${rows['MaSP']}">${rows['TenSP']}</a></h5>                
                       </div>
                       <div style="text-align:center"><input type="button" value="mua" onclick="addToCard(${rows['MaSP']})"></div>
                   </div>
                       `;
                    });

                    console.log(result);
            res.send(result);

        });

    });

});

app.get('/chitiet/:id', (_req,res)=>{   
    res.sendFile(__dirname +"/detail.html");
})

app.get('/getdetail/:id', function (req, res) {
    executeSQL(`select * from SANPHAM where MaSP ='${req.params.id}'`, (recordset) => {
         var row = recordset.recordsets[0][0];
            res.send(row);
    });
});
app.post('/search', function (req, res) {
    executeSQL(`select * from SANPHAM where TenSP like '%${req.body.search}%'`,(recordset)=> {
        if (recordset.recordsets[0] == undefined || recordset.recordsets[0].length === 0) {
            res.send("Không tìm thấy sản phẩm");
        }
        else {
            var result = "";
            recordset.recordsets[0].forEach(row => {
                result += `
                <div style='display:inline;height:35%;width:400px;float:left'>
                    <a href="/chitiet/${row['MaSP']}"><img style="
                    width:350px; height:33%;
                    border: 1px solid #ccc;
                    box-shadow: 5px 5px 0.5px #ccc;
                    background: rgba(128, 128, 255, 0.2);
                    " src='../imageMusic/${row['Filesp']}'/></a>
                    <div style="text-align:center;line-height: 30px;"><b>${row['TenSP']}</b></div>
                    <div style="text-align:center"><span style="color:red"> ${row['GiaBan']}$</span> </div>
                    
                 </div>
                 
                `;
            });
            res.send(result);
        }
    })
});

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
//SHOPPING CARD
app.get('/shoppingcard', (_req,res)=>{   
    res.sendFile(__dirname +"/shoppingcard.html");
});
app.post('/shoppingcard', function (req, res) {
    Shoppingcard.shoppingcard(`select * from SANPHAM where MaSP in'%${arrId}'`,(recordset)=> {
        if (recordset.recordsets[0] == undefined || recordset.recordsets[0].length === 0) {
            res.send("chưa co sản phẩm");
        }
        else {
            var result = "";
            recordset.recordsets[0].forEach(row => {
                result += `
                <div style='display:inline;height:35%;width:400px;float:left'>
                    <a href="/detail/${row['MaSP']}"><img style="
                    width:350px; height:33%;
                    border: 1px solid #ccc;
                    box-shadow: 5px 5px 0.5px #ccc;
                    background: rgba(128, 128, 255, 0.2);
                    " src='../imageMusic/${row['Filesp']}'/></a>
                    <div style="text-align:center;line-height: 30px;"><b>${row['TenSP']}</b></div>
                    <div style="text-align:center"><span style="color:red"> ${row['GiaBan']}$</span> </div>
                 </div>
                `;
            });
            res.send(result);
        }
    })
});
