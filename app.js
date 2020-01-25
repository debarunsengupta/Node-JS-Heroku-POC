var express = require('express');
var app = express();
var fs = require("fs");
 var jsforce = require('jsforce');
 const admZip = require('adm-zip');
//var unzip = require('unzip');
var extract = require('extract-zip');
const port = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log('Example app listening on port 3000'))
app.get('/api/listUsers/:test', function (req, res) {
	/*
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });*/
   
  console.log('Param passed-->'+req.params.test);//0690K00000PRtpIQAT
  let contId=req.params.test;
var conn = new jsforce.Connection();
conn.login('debarunsengupta2512@live.com', 'Dilip91@ecezWsdR5XXSgPPoEq4xuKnyKrM', function(err, res) {
  if (err) { return console.error(err); }
  conn.query("SELECT Id,VersionData FROM ContentVersion WHERE ContentDocumentId = '0690K00000PRtpIQAT' AND IsLatest = true", function(err, res) {
    if (err) { return console.error(err); }
	var contentbody=res.records[0];
	 var writeStream = fs.createWriteStream('./Incomingfile/output.zip');
	 conn.sobject("ContentVersion").record(contentbody.Id).blob('VersionData').pipe(writeStream);
    console.log('Response--->'+JSON.stringify(res));
	
	


  });
});


test();
		res.end('data');
	
	
})

function test()
{
	console.log('Extract Zip called');
	
	var zip = new admZip('./Incomingfile/output.zip');
    console.log('start unzip');
    	zip.extractAllTo("./ExtractedFile/",true);
}
/*var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})*/

