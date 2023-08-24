import oracledb from 'oracledb';
import { useRouter } from 'next/router';
import QuestionResult from '@/components/QuestionResult';

const studentUsername = "sadi";
export default function ExamReport({ reportInputData }) {
    let router = useRouter();
    console.log(reportInputData);

    let len = reportInputData.questionCount;
    let questionsArr = [];
    for (let i = 0; i < len; i++) {
        questionsArr.push(
            <li key={i}><QuestionResult questionObj={reportInputData.array[i]}
                actualAnswer={reportInputData.actualAnswers[i]}
                givenAnswer={reportInputData.givenAnswers[i]} /></li>
        )
    }

    return (
        <div className="ml-10">
            <ul className=" w-3/5">{questionsArr}</ul>
        </div>
    )
}

export const getServerSideProps = async (context) => {
    let queryData = context.query;
    if (!queryData) {
        return { redirect: { destination: '/exam', permanent: false } }
    }

    let reportInputData = {
        questionCount: -1,
        array: [],
        givenAnswers: "",
        actualAnswers: "",
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
            GET_EXAM_REPORT(:examId, :student, :p_cur, :answers);
        END;`;
    const data = await connection.execute(
        query,
        {
            examId: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: queryData.examId },
            student: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: studentUsername },
            p_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            answers: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        }
    );

    reportInputData.givenAnswers = data.outBinds.answers;
    reportInputData.questionCount = reportInputData.givenAnswers.length;
    const resultSet = data.outBinds.p_cur;
    const result = await resultSet.getRows();
    await connection.close();
    console.log(reportInputData.givenAnswers);
    // console.log(result);
    for (let i = 0; i < reportInputData.questionCount; i++) {
        let tmp = {
            id: i + 1,
            body: result[i].body,
            options: [result[i].optionA, result[i].optionB, result[i].optionC, result[i].optionD, result[i].optionE],
            image: result[i].image,
        };
        reportInputData.array.push(tmp);
        reportInputData.actualAnswers += result[i].answer;
    }
    return {
        props: {
            reportInputData
        }
    }
}