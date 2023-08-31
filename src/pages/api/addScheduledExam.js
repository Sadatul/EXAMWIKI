import oracledb from 'oracledb';

export default async function handler(req, res) {
    console.log(typeof req.body.questionMetaData.datetime);
    // res.send("OK");
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
    const questionTypeArrClass = await connection.getDbObjectClass("QUESTIONTYPEARR");
    const VARCHAR2ARR10 = await connection.getDbObjectClass("VARCHAR2ARR10");
    let tmp1 = [];
    let tmp2 = [];
    for (let i = 0; i < req.body.questionData.length; i++) {
        tmp1.push({
            BODY: req.body.questionData[i].body,
            OPTIONA: req.body.questionData[i].options[0],
            OPTIONB: req.body.questionData[i].options[1],
            OPTIONC: req.body.questionData[i].options[2],
            OPTIOND: req.body.questionData[i].options[3],
            OPTIONE: (req.body.questionData[i].options[4] === undefined) ? ''
                : req.body.questionData[i].options[4],
            IMAGE: req.body.questionData[i].image,
            ANSWER: req.body.questionData[i].answer,
            DIFFICULTY: req.body.questionData[i].difficulty,
        });
        tmp2.push(req.body.questionData[i].topicId);
    }
    const questions = new questionTypeArrClass(tmp1);
    const topics = new VARCHAR2ARR10(tmp2);
    // // console.log(questions);
    await connection.execute(
        `BEGIN
            SCHEDULEEXAM(:user, :topics, :q, :dur, :s_date);
        END;`,
        {
            user: req.body.teacherUsername,
            topics: topics,
            q: questions,
            dur: req.body.questionMetaData.duration,
            s_date: new Date(req.body.questionMetaData.datetime),
        }
    );
    await connection.commit();
    await connection.close();
    console.log("DONE");
    res.send("OK");

}
