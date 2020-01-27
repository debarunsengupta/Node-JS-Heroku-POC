var express = require('express');
var app = express();
var fs = require("fs");
const fs1 = require('fs-extra')
 var jsforce = require('jsforce');
 const admZip = require('adm-zip');
const port = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log('Example app listening on port 3000'))
app.get('/api/unExtractFile/:fileid', function (req, res) {

  console.log('Param passed-->'+req.params.fileid);//0690K00000PRtpIQAT

  let title;
  let base64result=[];
var conn = new jsforce.Connection();
conn.login('debarunsengupta2512@live.com', 'Dilip91@ecezWsdR5XXSgPPoEq4xuKnyKrM', function(err, restgot) {
  if (err) { return console.error(err); }
  //SELECT Id,VersionData,Title FROM ContentVersion WHERE ContentDocumentId = '0690K00000PRtpIQAT' AND IsLatest = true
  conn.query("SELECT Id,VersionData,Title FROM ContentVersion WHERE ContentDocumentId = '"+req.params.fileid+"' AND IsLatest = true", function(err, result) {
    if (err) { return console.error(err); }
	var contentbody=result.records[0];
	title=contentbody.Title;
	 var writeStream = fs.createWriteStream('./Incomingfile/'+contentbody.Title+'.zip');
	  //var writeStream = fs.createWriteStream('./Incomingfile/abc.zip');
	 conn.sobject("ContentVersion").record(contentbody.Id).blob('VersionData').pipe(writeStream);
    console.log('Response--->'+JSON.stringify(result));
	
	   writeStream.addListener('finish', function()
	   {
		   console.log('There');
		   extractFile('./Incomingfile/'+title+'.zip',title,function(resultfetched)
		   {
			  //console.log('base 64 line 36-->'+resultfetched); 
			  base64result=resultfetched;
			 res.send(JSON.stringify({FileContent: base64result}));
		   });
		  
	   });

  });
  
 
 
});
 
 //res.end('data');
	
});

app.get('/api/unExtractFile/:fileid', function (req, res) {
	console.log('line 80');
});

function extractFile(filename,actfile,callback)
{
	console.log('Extract Zip called:'+filename);
    console.log('Extract file called:'+actfile);
	
	try{
	//var zip = new admZip('./Incomingfile/Enforces_Userstories_SP201.1(22-01-2020).zip');
	//var zip = new admZip('./Incomingfile/abc.zip');
		var zip = new admZip(filename);
			//var zip = new admZip('./Enforces_Userstories_SP201.1(22-01-2020).zip');
	
	
    console.log('start unzip');
    	zip.extractAllTo("./ExtractedFile/",true);
		
		
		var eachfile=[];
    fs.readdir('./ExtractedFile/'+actfile+'/', function (err, files) {
    //handling error
	
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
		 var base64str = base64_encode('./ExtractedFile/'+actfile+'/'+file);
		eachfile.push(base64str);
		
        //console.log(a);
		
    });
	//console.log('eachfile-->'+eachfile);
     callback(eachfile);
	 
	//console.log('base64str---->'+base64str);
	//return base64str; //res.send(JSON.stringify({FileContent: base64str}));
});

	}
	catch(e){
console.log("exception: ", e);
}

}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


