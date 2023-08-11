// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import oracledb from "oracledb";

export default async function handler(req, res) {
  const connection = await oracledb.getConnection({
    user: "EXAMWIKI",
    password: "12345",  // contains the hr schema password
    connectString: "Atriox/orclpdb"
  });
  // The results comes as array of arrays....similiar to the rows we usually see in NAVICAT
  const result = await connection.execute(`SELECT * FROM QUESTIONS`);
  // console.log("Result is:", result.rows);

  await connection.close();

  res.json(result)
}
