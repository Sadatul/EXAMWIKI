import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { runQueryFromFile } from '@/utils/runQuery';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MyDTPicker from '@/components/MyDTPicker';

const initialData = {
    class: '',
    questionCount: -1,
    duration: 0,
    datetime: null,
};

export default function ScheduleExam({ repo }) {
    const classes = repo.rows;

    const [metaData, setMetaData] = useState(initialData);
    const router = useRouter();
    console.log(metaData);
    console.log(classes)
    let classOptionList = [];
    let i = 0;
    for (let item of classes) {
        classOptionList.push(
            <option key={i++} value={item.class}>
                {item.class}
            </option>
        );
    }

    return (
        <>
            <Head>
                <title>Schedule Exam</title>
            </Head>
            <div className="flex flex-row justify-center mt-5">
                <Form className="w-1/2 p-10 bg-slate-100 rounded-2xl shadow-2xl shadow-sky-500">
                    {/* <h1 className="mb-6 text-sky-600">SubjectInfo of Question</h1> */}
                    <Form.Group className="m-2" controlId="class">
                        <Form.Select
                            aria-label="Default select example"
                            id="eh-class" // eh = exam home
                            onChange={(e) => {
                                let tmp = { ...metaData };
                                tmp.class = e.target.value;
                                setMetaData(tmp);
                            }}
                        >
                            <option value="">Select Class</option>
                            {classOptionList}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="m-2" controlId="questionCount">
                        <Form.Select
                            aria-label="Default select example"
                            id="eh-questionCount" // eh = exam home
                            onChange={(e) => {
                                let tmp = { ...metaData };
                                tmp.questionCount = Number(e.target.value);
                                setMetaData(tmp);
                            }}
                        >
                            <option value="-1">Select Question Count</option>
                            <option value="5">5</option>
                            <option value="40">40</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="m-2" controlId="duration">
                        <Form.Control type='number' placeholder="Enter exam duration (in minutes)"
                            onChange={(e) => {
                                let tmp = { ...metaData };
                                tmp.duration = Number(e.target.value);
                                setMetaData(tmp);
                            }}
                        />
                        <p className='mt-2 text-sky-500'>Pick Exam Time</p>
                        <MyDTPicker metaData={metaData} setMetaData={setMetaData} />
                        {/* <Datetime className='text-center' value={metaData.datetime} dateFormat="DD-MM-YYYY" timeFormat="HH:mm a"
                        onChange={(e) => {
                            let tmp = { ...metaData };
                            tmp.datetime = e.toDate();
                            setMetaData(tmp);
                        }} /> */}
                    </Form.Group>

                    <div className="flex flex-row justify-end mr-3">
                        <Button
                            variant="primary"
                            disabled={
                                metaData.class == '' ||
                                metaData.questionCount == -1 ||
                                metaData.duration == 0 ||
                                metaData.datetime == null
                            }
                            onClick={() => {
                                var now = new Date();
                                var fourHoursLater = now.setHours(now.getHours()); // For testing purposes
                                // var fourHoursLater = now.setHours(now.getHours() + 2);
                                if (metaData.datetime < fourHoursLater) {
                                    alert('Please select a time atleast 2 hours from now')
                                    return
                                }

                                router.push({
                                    pathname: '/schedule-exam/set-questions',
                                    query: { metaData: JSON.stringify(metaData) },
                                });
                            }}

                        >
                            {' '}
                            Goto Exam
                        </Button>
                    </div>
                </Form>
                {/* <Link
                href={{
                    pathname: '/exam/practice',
                    query: { questionMetaData: 'my-post' },
                }}
            ></Link> */}

                {/* <Exam questionMetaData={questionMetaData} /> */}
            </div>
        </>
    )
}

export const getStaticProps = async () => {
    const res = await runQueryFromFile('getAllClasses');
    const repo = {
        rows: res.rows,
    };
    return { props: { repo } };
};
