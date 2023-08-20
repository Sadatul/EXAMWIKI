import Exam from "@/components/Exam";
// import { runQueryFromFile } from "@/utils/runQuery";
import oracledb from 'oracledb';


export default function practiceExamPage({ questionsData }) {
    // console.log(questionsData);

    // If the user doesn't follow proper procedure to get to this page
    // then redirect them to the home exam page
    return <Exam questionsData={questionsData} />
}

export const getServerSideProps = async (context) => {
    let examData = context.query.examData;
    // If the user doesn't follow proper procedure to get to this page
    // then redirect them to the home exam page
    if (!examData) {
        return { redirect: { destination: '/exam', permanent: false } }
    }
    examData = JSON.parse(examData);
    console.log(examData);

    let questionsData = {
        error: false,
        questionCount: examData.questionCount,
        array: []
    }

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
    const data = await connection.execute(
        query,
        {
            diff: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: examData.difficulty },
            questionCount: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: examData.questionCount },
            p_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            class: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: examData.class },
            subject: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: examData.subject },
            chapter: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: examData.chapter },
            topic: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: examData.topic },
        }
    );

    const resultSet = data.outBinds.p_cur;
    const result = await resultSet.getRows();
    // const result = await runQueryFromFile('getAllQuestions');

    // questionsData.questionCount = result.length;

    for (let i = 0; i < questionsData.questionCount; i++) {
        let tmp = {
            id: i + 1,
            body: result[i].body,
            options: [result[i].optionA, result[i].optionB, result[i].optionC, result[i].optionD, result[i].optionE],
            image: result[i].image

        };
        questionsData.array.push(tmp);
    }
    return { props: { questionsData } }
}