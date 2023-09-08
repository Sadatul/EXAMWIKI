import oracledb from 'oracledb';

export default async function handler(req, res) {
    console.log("This is req.body");
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
    const questionTypeArrClass = await connection.getDbObjectClass("QUESTIONTYPEARR");
    let tmp = []
    for (let i = 0; i < req.body.questionData.length; i++) {
        tmp.push({
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
        })
    }
    const questions = new questionTypeArrClass(tmp);
    // console.log(questions);
    await connection.execute(
        `BEGIN
            INSERT_QUESTION(:user, :class, :subject, :chapter, :topic, :q);
        END;`,
        {
            user: req.body.studentUsername,
            class: req.body.questionMetaData.class,
            subject: req.body.questionMetaData.subject,
            chapter: req.body.questionMetaData.chapter,
            topic: req.body.questionMetaData.topic,
            q: questions,
        }
    );
    await connection.commit();
    await connection.close();
    console.log("DONE");

}
