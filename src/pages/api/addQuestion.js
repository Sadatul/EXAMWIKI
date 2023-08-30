import oracledb from 'oracledb';

export default async function handler(req, res) {
    console.log(req.body);
    res.send("OK");
    // try {
    //     oracledb.getPool();
    // } catch (e) {
    //     await oracledb.createPool({
    //         user: process.env.DB_USER,
    //         password: process.env.DB_PASSWORD,
    //         connectString: process.env.DB_CONNECT_STRING,
    //     });
    // }
    // const connection = await oracledb.getConnection();
    // const query = `BEGIN
    //         INSERTION_PACKAGE.EXAM_INFO_INSERT(:students, :questions, :examId, :duration);
    //     END;`;
    // const result = await connection.execute(
    //     query,
    //     {
    //         students: {
    //             dir: oracledb.BIND_IN,
    //             type: oracledb.STRING,
    //             val: ["sadi"]
    //         },
    //         questions: {
    //             dir: oracledb.BIND_IN,
    //             type: oracledb.NUMBER,
    //             val: [1, 2, 3, 4, 5]
    //         },
    //         examId: {
    //             dir: oracledb.BIND_IN,
    //             type: oracledb.STRING,
    //             val: "exam01"
    //         },
    //         duration: {
    //             dir: oracledb.BIND_IN,
    //             type: oracledb.NUMBER,
    //             val: 30
    //         }

    //     }
    // );

    // // const resultSet = result.outBinds.p_cur;
    // // const resultRows = await resultSet.getRows();
    // // console.log(resultRows.length);
    // res.status(200).json({ data: "PACKED" });
}
