import oracledb from 'oracledb';

export default async function handler(req, res) {
    console.log(req.body);
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
    // console.log(questions);
    await connection.execute(
        `DELETE FROM EXAM WHERE "id" = :examId`,
        {
            examId: req.body.examId,
        }
    );
    connection.commit();
    await connection.close();
    console.log("DONE");
    res.send("OK");

}
