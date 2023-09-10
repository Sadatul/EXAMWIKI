import { runQuery, runQueryFromFile } from "@/utils/runQuery";
import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

export default function showScheduledExam({ repo }) {
    const router = useRouter();
    let scheduledExams = repo.rows;
    console.log(scheduledExams);
    let renderScheduledExams = [];
    function handler(e) {
        console.log(e.target.id);
        let tmp = e.target.id.split('-');
        console.log(scheduledExams[Number(tmp[1])])
        router.push({
            pathname: 'show-scheduled-exam/show-exam-details',
            query: scheduledExams[Number(tmp[1])]
        })
        console.log(scheduledExams[Number(tmp[1])].id);
    }
    for (let i = 0; i < scheduledExams.length; i++) {
        renderScheduledExams.push(
            <div key={i} className="grid grid-cols-3 grid-rows-3 mt-3
            bg-slate-100 rounded-2xl p-8 shadow-lg font-bold
             text-slate-600 hover:bg-slate-600 hover:text-slate-100"
            >
                <p className=" text-center">Exam Id: {scheduledExams[i].id}</p>
                <p className=" text-center">Rated For Class: {scheduledExams[i].class}</p>
                <p className=" text-center">Organizer: {scheduledExams[i].organizer}</p>
                <p className=" col-span-3 text-center">{new Date(scheduledExams[i].startDate).toString()}</p>
                <p className=" text-center">Duration: {scheduledExams[i].duration} Minutes</p>
                <p></p>
                <p className=" text-center">Number of questions: {scheduledExams[i].QUESTION_COUNT}</p>
                <div className="col-span-3 text-center">
                    <Button variant='outline-info' id={"scheduledExm-" + i} onClick={handler}>More Details</Button>
                </div>

                {/* <p className="col-span-3 text-center" id={"scheduledExm-" + i}
                    onClick={handler}
                > More Details </p> */}
            </div>
        );
    }
    return (<div className=" w-2/3 mx-auto">
        {
            repo.schedule_exam ? <div className="text-center my-10">
                <Button
                    variant="primary"
                    onClick={() => {
                        router.push({
                            pathname: '/schedule-exam',
                        });
                    }}
                >
                    {' '}
                    Schedule A New Exam{' '}
                </Button>
            </div> : ""
        }
        {renderScheduledExams}
    </div>
    );

}

export const getServerSideProps = async (context) => {
    const res = await runQueryFromFile('getAllScheduledExams');

    for (let i = 0; i < res.rows.length; i++) {
        res.rows[i].startDate = res.rows[i].startDate.toISOString();
    }

    const repo = {
        rows: res.rows,
        schedule_exam: false,
    };
    try {
        const { username, type } = getUserInfoFromRequest(context.req);
        if (type === "teacher") {
            const teacherDataResult = await runQuery(
                'SELECT * FROM TEACHERS WHERE "username"=:username',
                false,
                {
                    username: username,
                }
            );
            repo.schedule_exam = teacherDataResult.rows[0].isVerified === "Y";
        }
        console.log(repo);
        return { props: { repo } };
    }
    catch (e) {
        console.log(repo);
        return { props: { repo } };
    }
    // console.log(res.rows);
    // console.log(typeof res.rows[0].startDate);
}