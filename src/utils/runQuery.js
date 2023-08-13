import oracledb from 'oracledb';
import fs from 'fs';
import path from 'path';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function runQuery(query, commit, bindVariables) {
  try {
    oracledb.getPool();
  } catch (e) {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
  }
  const connection = await oracledb.getConnection();

  const result = await connection.execute(
    query,
    bindVariables ? bindVariables : {}
  );

  if (commit) await connection.commit();

  await connection.close();

  return result.rows;
}

export async function runQueryFromFile(
  filePathRelativeToSQLFolder,
  commit,
  bindVariables
) {
  if (
    filePathRelativeToSQLFolder.length < 4 ||
    filePathRelativeToSQLFolder.substr(
      filePathRelativeToSQLFolder.length - 4,
      4
    ) != '.sql'
  ) {
    filePathRelativeToSQLFolder += '.sql';
  }

  let actualPath = __dirname;
  while (actualPath.indexOf('.next') != -1) {
    actualPath = path.join(actualPath, '..');
  }
  actualPath = path.join(actualPath, 'src', 'SQL', filePathRelativeToSQLFolder);

  const queryString = fs.readFileSync(actualPath, { encoding: 'utf-8' });
  const result = await runQuery(queryString, commit, bindVariables);
  return result;
}
