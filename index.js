const { parse } = require("csv-parse");
const fs = require("fs");

const kData = [];

function isPlanetHabitable(planetData) {
  const isConfirmed = planetData["koi_disposition"] === "CONFIRMED";
  const isLightEnough =
    planetData["koi_insol"] > 0.36 && planetData["koi_insol"] < 1.11;

  const isAMatchingRadius = planetData["koi_prad"] < 1.6;

  return isConfirmed && isLightEnough && isAMatchingRadius;
}

const parserReadableStream = fs
  .createReadStream("./data.csv")
  .pipe(
    parse({
      columns: true,
      comment: "#",
    })
  )
  .on("data", function (data) {
    if (isPlanetHabitable(data)) {
      kData.push(data);
    }
  })
  .on("end", function () {
    console.log("Done");
    console.log(kData.length);
  })
  .on("error", function (err) {
    console.log("Failed To Read File", err);
  });
