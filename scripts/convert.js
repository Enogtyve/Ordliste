const fs = require('fs');
const path = require('path');

const prefaceInputPath = path.resolve(__dirname, '../preface.md');
const jsonInputPath = path.resolve(__dirname, '../terms.json');
const readmeMdOutputPath = path.resolve(__dirname, '../README.md');

const json = JSON.parse(fs.readFileSync(jsonInputPath, 'utf8'));

const duplicateLookup = [];
const errors = json.flatMap(o => {
    const e = [];
    ["Term", "English", "Description"].forEach(key => {
        const val = o[key];
        if (!val) {
            e.push(key + " is empty: " + val);
        } else if (/^[a-z]/.test(val)) {
            e.push(key + " starts with lowercase: " + val);
        } else if (val.trim() !== val) {
            e.push(key + " is not trimmed: " + val);
        } else if (key === "Description" && !val.endsWith(".")) {
            e.push("Description does not end with a '.': " + val);
        } else {
            if (!(key in duplicateLookup)) {
                duplicateLookup[key] = [];
            }
            if (duplicateLookup[key].includes(val)) {
                e.push(key + " has a duplicate: " + val);
            } else {
                duplicateLookup[key].push(val);
            }
        }
    });
    return e;
});

if (errors.length) {
    throw "There are errors in the input data:\n" + errors.join("\n");
}


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
