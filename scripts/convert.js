const fs = require('fs');
const path = require('path');

const prefaceInputPath = path.resolve(__dirname, '../preface.md');
const bitcoinInputPath = path.resolve(__dirname, '../bitcoin.json');
//const bitcoinMdOutputPath = path.resolve(__dirname, '../bitcoin.md');
const readmeMdOutputPath = path.resolve(__dirname, '../README.md');

const bitcoinJson = JSON.parse(fs.readFileSync(bitcoinInputPath, 'utf8'));

bitcoinJson.sort((a, b) => a.Term.localeCompare(b.Term));

const tablePreamble = "| Begreb | På engelsk | Beskrivelse | Links |\n" +
    "|-|-|-|-|";

const tableData = bitcoinJson.map(o => {
    const links = (o.Links || []).map(link => "[" + link.Title + "](" + link.Href + ")").join("  ")
    return "| " + o.Term.trim() + " | *" + o.English.trim() + "* | " + o.Description.trim() + " | " + links + " |";
}).join("\n");

const bitcoinTable = tablePreamble + "\n" + tableData;

//console.log(bitcoinTable);

//fs.writeFileSync(bitcoinMdOutputPath, bitcoinTable, 'utf8');

const prefaceMd = fs.readFileSync(prefaceInputPath, 'utf8');
const readmeMd = prefaceMd + "\n\n## Bitcoinbegreber\n" + bitcoinTable;

console.log(readmeMd);

fs.writeFileSync(readmeMdOutputPath, readmeMd, 'utf8');
