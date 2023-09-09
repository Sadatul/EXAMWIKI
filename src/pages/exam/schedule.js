import Exam from "@/components/Exam";
// import { runQueryFromFile } from "@/utils/runQuery";
import oracledb from 'oracledb';


const studentUserName = "Sadi";

export default function scheduleExamPage({ questionsData }) {
    // console.log(questionsData);

    // If the user doesn't follow proper procedure to get to this page
    // then redirect them to the home exam page
    return <div className="w-3/4">
        <Exam questionsData={questionsData} />
    </div>
}

export const getServerSideProps = async (context) => {
    let examData = context.query.examData;
    if (!examData) {
        return { redirect: { destination: '/show-scheduled-exam', permanent: false } }
    }
    examData = JSON.parse(examData);
    // We need examId and questionCount in examData
    console.log(examData);

    let questionsData = {
        error: false,
        questionCount: Number(examData.questionCount),
        array: [],
        examId: examData.examId,
        questionIds: [], // This will be used to track the question ids in exact order
        examDuration: -1,
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
            GET_SCHEDULE_EXAM_QUESTIONS(:studentUserName, :examId, :p_cur, :duration);
        END;`;
    const data = await connection.execute(
        query,
        {
            studentUserName: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: studentUserName },
            examId: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: examData.examId },
            p_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            duration: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        }
    );

    let tmp = new Date(examData.startDate);
    let dif = new Date() - tmp;
    dif = Math.round((dif / 1000) / 60);
    if (dif < 0) dif = 0;

    const resultSet = data.outBinds.p_cur;
    questionsData.examDuration = data.outBinds.duration - dif;
    const result = await resultSet.getRows();

    for (let i = 0; i < result.length; i++) {
        // questionIds.push(result[i].id);
        questionsData.questionIds.push(result[i].id);
    }
    console.log(questionsData.questionIds);
    console.log(questionsData.examId);

    for (let i = 0; i < questionsData.questionCount; i++) {
        let tmp = {
            id: i + 1,
            body: result[i].body,
            options: [result[i].optionA, result[i].optionB, result[i].optionC, result[i].optionD, result[i].optionE],
            image: result[i].image,
        };
        questionsData.array.push(tmp);
    }

    connection.commit();
    await connection.close();

    return { props: { questionsData } };
}
