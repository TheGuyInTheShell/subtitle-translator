module.exports.createFile = (fs, arr, name = "text.srt") => {
  fs.writeFileSync(
    `tests/outputs/${name}`,
    arr.join("\n"),
    (err) => {
      if (err) throw err;
      console.log("finish");
    }
  );
};
