const Excel = require("exceljs");

async function leerExcel(filename) {
  // read from a file
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);
  // ... use workbook

  const worksheet = workbook.getWorksheet(1);

  // Iterate over all rows that have values in a worksheet
  //   worksheet.eachRow(function (row, rowNumber) {
  //     console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
  //   });

  worksheet.eachRow((row) => {
    console.log(JSON.stringify(row.values));
  });
}

leerExcel("./prueba.xlsx");
