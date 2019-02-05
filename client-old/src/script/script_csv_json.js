let csvToJson = require('convert-csv-to-json');
 
let fileInputName = './data/data.csv'; 
let fileOutputName = './data/data.json';

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
