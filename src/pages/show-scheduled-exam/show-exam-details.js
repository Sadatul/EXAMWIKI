import oracledb from 'oracledb';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
// const studentUserName = "Sadi";
import { useRouter } from 'next/router';
import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';

export default function showExamDetails({ repo }) {
    // Here repo has type which specifies which type of user has logged in
    // If he is a student , isRegistered can have three types of value
    // REGISTERED, TAKEN and IN_DATE... IN_DATE means hasn't registered yet
    // Here student type requires the state variable but the teacher type doesn't 
    // so for teacher we still create the state variable but it never gets changed
    // so we keep things as it is

    // BUT teacher type user has only two values in REGI
    console.log(repo);
    const [isRegistered, setIsRegistered] = useState(repo.isRegistered == 'REGISTERED'
        || repo.isRegistered == "TAKEN");

    let buttonToRender = "";
    const router = useRouter();
    if (repo.type == "student") {
        // Only for student types we need to check this conditions
        if (!isRegistered) {
            buttonToRender = <Button variant='success'
                onClick={async () => {
                    await fetch('/api/registerToExam', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            studentUserName: repo.username,
                            examId: repo.id,
                        }),
                    })
                    setIsRegistered(true);
                }}
            >Register</Button>
        } else if (repo.isRegistered == 'TAKEN') {
            buttonToRender = <Button variant='warning'
                onClick={async () => {
                    router.push({
                        pathname: '/exam/exam_report',
                        query: {
                            examId: repo.id,
                        }
                    })
                }}
            >Show Answers</Button>
        }
        else {
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
                                    startDate: repo.startDate,
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
                                studentUserName: repo.username,
                                examId: repo.id,
                            }),
                        })
                        setIsRegistered(false);
                    }}
                >Unregister</Button>
            }

        }
    } else if (repo.type == "teacher" && repo.isRegistered == "ORGNIZED") {
        let tmpDate = new Date(repo.startDate);
        let thirtyMinutesBefore = new Date(tmpDate - 30 * 60 * 1000);
        if (thirtyMinutesBefore > new Date()) {


            buttonToRender = <Button variant='danger'
                onClick={async () => {
                    let tmpDate = new Date(repo.startDate);
                    let thirtyMinutesBefore = new Date(tmpDate - 30 * 60 * 1000);
                    if (thirtyMinutesBefore < new Date()) {
                        router.reload();
                        return;
                    }


                    await fetch('/api/deleteScheduledExam', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            teacherUserName: repo.username,
                            examId: repo.id,
                        }),
                    })

                    router.replace('/show-scheduled-exam');
                    // setIsRegistered(false);
                }}
            >Delete</Button>
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
            <div className='col-span-3 text-center'> {buttonToRender} </div>
        </div>
    </div>
}

export const getServerSideProps = async (context) => {
    try {
        console.log(context.query);

        if (!context.query.id) {
            return { redirect: { destination: '/show-scheduled-exam', permanent: false } }
        }

        const { username, type } = getUserInfoFromRequest(context.req);
        const studentUserName = username;

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
        let renderStatement = "";
        if (type == "student") {
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
            renderStatement = data.outBinds.isRegistered;
        } else {
            const query = `BEGIN
            IS_ORGANIZER_OF_EXAM(:studentUserName, :examId, :isRegistered);
            END;`;
            const data = await connection.execute(
                query,
                {
                    examId: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: context.query.id },
                    isRegistered: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    studentUserName: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: studentUserName },
                }
            );
            renderStatement = data.outBinds.isRegistered;
        }

        connection.close();
        return {
            props: {
                repo: {
                    ...context.query,
                    isRegistered: renderStatement,
                    type: type,
                    username: studentUserName
                }
            }
        }
    } catch (e) {
        // console.log(e);
        return { redirect: { destination: '/login', permanent: false } }
    }
}