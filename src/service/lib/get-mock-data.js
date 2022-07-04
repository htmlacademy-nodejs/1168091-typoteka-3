import fs from "fs/promises";
const FILENAME = `mocks.json`;
let data = [];

export const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.log(err);
    return (err);
  }

  return data;
};
