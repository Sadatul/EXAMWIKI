import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { questionDataContext, setQuestionDataContext } from '@/components/addQuestionContext';
import SetQuestionSchedule from '@/components/setQuestionSchedule';
import { runQueryFromFile } from '@/utils/runQuery';
import Table from 'react-bootstrap/Table';

const teacherUsername = "sadi";
const initialQuestionObject = {
    body: "",
    options: ["", "", "", ""],
    image: "",
    answer: "",
    difficulty: -1,
    topicId: ""
}


export default function setQuestionPage({ questionMetaData }) {
    questionMetaData.datetime = new Date(questionMetaData.datetime);
    // console.log(questionMetaData);
    const router = useRouter();
    let tmp = [];
    let renderList = [];
    for (let i = 0; i < questionMetaData.questionCount; i++) {
        tmp.push(initialQuestionObject);
    }

    let topicList = [];
    for (let i = 0; i < questionMetaData.topics.length; i++) {
        topicList.push(
            <tr key={i}>
                <td>{questionMetaData.topics[i].topicId}</td>
                <td>{questionMetaData.topics[i].chapter}</td>
                <td>{questionMetaData.topics[i].topic}</td>
            </tr>
        );
    }
    // console.log(tmp);
    const [questionData, setQuestionData] = useState(tmp);
    // let [questionList, setQuestionList] = useState(renderList);
    // if (questionData.length == 0) {
    //     let tmp = [];
    //     let renderList = [];
    //     for (let i = 0; i < questionMetaData.questionCount; i++) {
    //         tmp.push(initialQuestionObject);
    //         renderList.push(<SetQuestion
    //             key={i}
    //             index={i}
    //             deleteButton={false}
    //         />);
    //     }
    //     setQuestionData(tmp);
    //     setQuestionList(renderList);
    // }
    console.log(questionData);
    // console.log("Re-renders");

    for (let i = 0; i < questionMetaData.questionCount; i++) {
        renderList.push(<SetQuestionSchedule
            key={i}
            index={i}
            questionData={questionData}
            setQuestionData={setQuestionData}
            topicIds={questionMetaData.topicIds}
        />);
    }

    // This will be an array of objects where we store the question data
    // for each question individually.
    return <div>
        <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3 mt-5 w-1/2 mx-auto"
        >
            <Tab eventKey="home" title="Set Questions">
                <div>
                    {renderList}
                    <Button className='fixed top-32 right-16' variant='success' onClick={async (e) => {
                        for (let i = 0; i < questionData.length; i++) {
                            if (questionData[i].deleted) continue;
                            if (questionData[i].body == "") {
                                alert("Question " + (i + 1) + " has no body");
                                return;
                            }
                            if (questionData[i].answer == "") {
                                alert("Question " + (i + 1) + " has no answer");
                                return;
                            }
                            if (questionData[i].difficulty == -1) {
                                alert("Question " + (i + 1) + " has no difficulty");
                                return;
                            }
                            if (questionData[i].options[0] == "") {
                                alert("Question " + (i + 1) + " has no option A");
                                return;
                            }
                            if (questionData[i].options[1] == "") {
                                alert("Question " + (i + 1) + " has no option B");
                                return;
                            }
                            if (questionData[i].options[2] == "") {
                                alert("Question " + (i + 1) + " has no option C");
                                return;
                            }
                            if (questionData[i].options[3] == "") {
                                alert("Question " + (i + 1) + " has no option D");
                                return;
                            }
                            if (questionData[i].options.length > 4 && questionData[i].options[4] == "") {
                                alert("Question " + (i + 1) + " has no option E");
                                return;
                            }
                            if (questionData[i].topicId == "") {
                                alert("Question " + (i + 1) + " has no topic");
                                return;
                            }
                        }

                        await fetch('/api/addScheduledExam', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                questionMetaData,
                                questionData: questionData,
                                teacherUsername
                            }),
                        })

                        router.replace('/schedule-exam');
                    }}>
                        Submit
                    </Button>
                </div>
            </Tab>
            <Tab eventKey="profile" title="Topic Information">
                <div className="w-2/3 mt-5 mx-auto">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Topic ID</th>
                                <th>Chapter</th>
                                <th>Topic</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topicList}
                        </tbody>
                    </Table>
                </div>
            </Tab>
        </Tabs>
    </div>

}

export const getServerSideProps = async (context) => {
    let questionMetaData = context.query.metaData;
    if (!questionMetaData) {
        return { redirect: { destination: '/schedule-exam', permanent: false } }
    }
    questionMetaData = JSON.parse(questionMetaData);
    // console.log(questionMetaData);

    let res = await runQueryFromFile('getTopicFromClass', false, {
        class: questionMetaData.class,
    });
    questionMetaData.topics = res.rows;
    questionMetaData.topicIds = res.rows.map((item) => {
        return item.topicId;
    });
    console.log(questionMetaData);
    return {
        props: {
            questionMetaData
        }
    }
}
