import oracledb from 'oracledb';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
const studentUserName = "sadi";
import { useRouter } from 'next/router';

export default function showExamDetails({ repo }) {
    console.log(repo);
    const [isRegistered, setIsRegistered] = useState(repo.isRegistered == 'REGISTERED');

    let buttonToRender = "";
    const router = useRouter();
    if (!isRegistered) {
        buttonToRender = <Button variant='success'
            onClick={async () => {
                await fetch('/api/registerToExam', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        studentUserName: studentUserName,
                        examId: repo.id,
                    }),
                })
                setIsRegistered(true);
            }}
        >Register</Button>
    } else {
        let tmpDate = new Date(repo.startDate);
        if (tmpDate < new Date()) {
            buttonToRender = <Button variant='success'
                onClick={async () => {
                    router.push({
                        pathname: '/exam/schedule',
                        query: {
                            examData: JSON.stringify({
                                examId: repo.id,
                                questionCount: repo.QUESTION_COUNT,
                            })
                        }
                    })
                }}
            >Start Exam</Button>
        } else {
            buttonToRender = <Button variant='danger'
                onClick={async () => {
                    await fetch('/api/unregisterFromExam', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            studentUserName: studentUserName,
                            examId: repo.id,
                        }),
                    })
                    setIsRegistered(false);
                }}
            >Unregister</Button>
        }

    }
    // Repo isRegisterd is either 'REGISTERED' or 'IN_DATE'
    // IN_DATE means he is not registered but he can register
    return <div>
        <div className="grid grid-cols-3 grid-rows-3 mt-3 w-2/3 mx-auto
    bg-slate-100 rounded-2xl p-8 shadow-lg font-bold
     text-slate-600 hover:bg-slate-600 hover:text-slate-100"
        >
            <p className=" text-center">Exam Id: {repo.id}</p>
            <p className=" text-center">Rated For Class: {repo.class}</p>
            <p className=" text-center">Organizer: {repo.organizer}</p>
            <p className=" col-span-3 text-center">{new Date(repo.startDate).toString()}</p>
            <p className=" text-center">Duration: {repo.duration} Minutes</p>
            <p></p>
            <p className=" text-center">Number of questions: {repo.QUESTION_COUNT}</p>
        </div>
        {buttonToRender}
    </div>
}

export const getServerSideProps = async (context) => {
    console.log(context.query);

    if (!context.query.id) {
        return { redirect: { destination: '/show-scheduled-exam', permanent: false } }
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
        EXAM_REGISTRATION_CHECK(:studentUserName, :examId, :isRegistered);
            END;`;
    const data = await connection.execute(
        query,
        {
            examId: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: context.query.id },
            isRegistered: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            studentUserName: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: studentUserName },
        }
    );
    if (data.outBinds.isRegistered == 'OUT_OF_DATE') {
        return { redirect: { destination: '/show-scheduled-exam', permanent: false } }
    }

    connection.close();
    return {
        props: {
            repo: {
                ...context.query,
                isRegistered: data.outBinds.isRegistered
            }
        }
    }
}