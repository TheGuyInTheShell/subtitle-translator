const translate = require("@iamtraction/google-translate");
const fs = require("fs");

const filename =
  "1. Cybercrime Understanding the Threats of the Digital World (2).srt";

const route = `${__dirname}/tests/inputs/${filename}`;

const readline = require("readline");
const { createFile } = require("./src/utils/createFile");

let reader = readline.createInterface({
  input: fs.createReadStream(route),
});

const arrTranslated = [];
const arrPromises = [];
let lineCount = 0;

putInArrayTrs = (tr, lineNum) => {
  arrTranslated[lineNum - 1] = tr.text;
};


reader.on("line", (line) => {
  lineCount += 1;
  const actualLine = lineCount;

  if (/^[0-9]*$/.test(line)) {
    arrTranslated.push(line);
    return;
  }
  if (/[0-9]+( --> )+[0-9]/g.test(line)) {
    arrTranslated.push(line);
    arrTranslated.push("");
    return;
  }

  arrPromises.push(
    new Promise((resp, rej) => {
      translate(line, { from: "es", to: "es" })
        .then((res) => {
          return resp([res, actualLine]);
        })
        .catch((err) => {
          console.log(err);
          rej("error");
        });
    })
  );
});

reader.on("close", async (res) => {
  const promises = await Promise.all(arrPromises);
  promises.forEach((promise) => {
    const [result, actualLine] = promise;
    putInArrayTrs(result, actualLine);
  });
  arrTranslated.push("");
  createFile(fs, arrTranslated)
});
