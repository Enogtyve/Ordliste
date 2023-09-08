const fs = require('fs');
const path = require('path');

const prefaceInputPath = path.resolve(__dirname, '../preface.md');
const jsonInputPath = path.resolve(__dirname, '../terms.json');
const readmeMdOutputPath = path.resolve(__dirname, '../README.md');

const json = JSON.parse(fs.readFileSync(jsonInputPath, 'utf8'));

json.sort((a, b) => a.Term.localeCompare(b.Term));

const tablePreamble = "| Begreb | På engelsk | Beskrivelse | Links |\n" +
    "|-|-|-|-|";

const tableData = json.map(o => {
    const links = (o.Links || []).map(link => "[" + link.Title + "](" + link.Href + ")").join("  ")
    return "| " + o.Term.trim() + " | *" + o.English.trim() + "* | " + o.Description.trim() + " | " + links + " |";
}).join("\n");

const formattedTable = tablePreamble + "\n" + tableData;

const prefaceMd = fs.readFileSync(prefaceInputPath, 'utf8');
const readmeMd = prefaceMd + "\n\n## Begreber\n" + formattedTable;

console.log(readmeMd);

fs.writeFileSync(readmeMdOutputPath, readmeMd, 'utf8');
