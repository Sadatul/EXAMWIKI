
import oracledb from 'oracledb';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';

const studentUsername = "sadi";

export default function examResultPage({ resultData }) {
    const router = useRouter();
    // resultData.correctCount = 20;
    let status = resultData.message == 'Submission Successful';

    return <div className='flex flex-row justify-center mt-5'>
        <div className={'w-1/2 bg-slate-100 rounded-2xl p-10 shadow-2xl ' +
            (resultData.correctCount > 0.5 * resultData.questionCount ? 'shadow-green-500' : 'shadow-red-500')
        }>
            <p className={'text-center text-2xl font-bold ' + (status ? 'text-green-500' : 'text-red-500')}>
                {resultData.message}</p>
            <p className='text-center mt-10 text-4xl font-bold'>Your Score: </p>
            <p className='text-center mb-10 text-4xl font-bold'> {resultData.correctCount} / {resultData.questionCount}</p>
            <div className='flex flex-row justify-evenly'>
                <Button variant={resultData.correctCount > 0.5 * resultData.questionCount ? "success" : "danger"}
                    onClick={() => {
                        router.push({
                            pathname: '/exam/exam_report',
                            query: {
                                examId: resultData.examId,
                            }
                        })
                    }}
                >
                    Show Answers
                </Button>
                <Button variant="primary"
                    onClick={() => {
                        router.push({
                            pathname: '/exam',
                        })
                    }}
                >
                    More Practice
                </Button>
            </div>
        </div>
    </div>
}

export const getServerSideProps = async (context) => {
    let queryData = context.query;
    if (!queryData) {
        return { redirect: { destination: '/exam', permanent: false } }
    }

    let resultData = {
        message: queryData.message,
        questionCount: queryData.answers.length,
        correctCount: 0,
        examId: queryData.examId
    }
    console.log(queryData);
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
            ANSWER_UPDATE(:examId, :student, :answers, :correctCount);
        END;`;

    const data = await connection.execute(
        query,
        {
            examId: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: queryData.examId },
            answers: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: queryData.answers },
            student: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: studentUsername },
            correctCount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        }
    );


    resultData.correctCount = data.outBinds.correctCount;
    console.log(resultData);

    await connection.commit(); // This is essential to save the changes
    await connection.close();

    return {
        props: {
            resultData
        }
    }
}