
import oracledb from 'oracledb';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';

const studentUsername = "sadi";

export default function examResultPage({ resultData }) {
    const router = useRouter();

    return <div>
        <div>
            <h2>{resultData.message}</h2>
            <h1>You have scored {resultData.correctCount} / {resultData.questionCount}</h1>
            <div>
                <Button variant="primary"
                    onClick={() => {
                        router.push({
                            pathname: '/exam',
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
    console.log(queryData.message);
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
            student: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: 'sadi' },
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