const sql= require('./Sql');

function shoppingcard(arrProductId,cb){
    sql.executeSQL(`select * from SANPHAM where MaSP in'%${arrProductId}'`, (recordset)=>{
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
            cb(result);
    }
  })
}
module.exports={
    shoppingcard: shoppingcard,
}