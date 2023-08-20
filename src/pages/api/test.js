import { runQueryFromFile } from '@/utils/runQuery';
import oracledb from 'oracledb';

export default async function handler(req, res) {
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
    const query = `BEGIN
            GENERATE_QUESTION(:diff, :questionCount, :p_cur, :class, :subject, :chapter, :topic);
        END;`;
    const result = await connection.execute(
        query,
        {
            diff: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: 1 },
            questionCount: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: 20 },
            p_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            class: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: 'HSC' },
            subject: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: 'Bangla' },
            chapter: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: 'chapter01' },
            topic: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: 'topic01' },
        }
    );

    const resultSet = result.outBinds.p_cur;
    const resultRows = await resultSet.getRows();
    console.log(resultRows.length);
    res.status(200).json({ data: resultRows });
}
