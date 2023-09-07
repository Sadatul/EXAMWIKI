import oracledb from 'oracledb';

export default async function handler(req, res) {
    console.log(req.body);
    res.send("OK");
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
        `INSERT INTO SCHEDULEDEXAMREGISTERED VALUES(:examId, :studentUserName)`,
        {
            examId: req.body.examId,
            studentUserName: req.body.studentUserName,
        }
    );
    connection.commit();
    await connection.close();
    console.log("DONE");

}
