import fs from 'fs';
import readline from 'readline';
interface CSVRecords {
  [key: string]: string;
}

export async function csvUtils(filePath: string): Promise<CSVRecords[]> {
  const result: CSVRecords[] = [];
  let header: string[] = [];
  const fileStream = fs.createReadStream(filePath);
  const rline = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const ln of rline) {
    const lnValue = ln.split(',');

    // If header not set first line will take
    if (header.length === 0) {
      header = lnValue;
    } else {
      // Create new obj
      const records: CSVRecords = {};

      header.forEach((htitle, i) => {
        records[htitle] = lnValue[i] || '';
      });
      result.push(records);
    }
  }

  return result;
}
