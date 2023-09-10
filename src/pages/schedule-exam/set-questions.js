import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { questionDataContext, setQuestionDataContext } from '@/components/addQuestionContext';
import SetQuestionSchedule from '@/components/setQuestionSchedule';
import { runQuery, runQueryFromFile } from '@/utils/runQuery';
import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import Table from 'react-bootstrap/Table';

// const teacherUsername = "sadi";
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
            className="mb-3 pt-4 pb-2 px-5 w-2/3 mx-auto sticky top-0 z-10 bg-white"
            justify
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
                                teacherUserName: questionMetaData.teacherUserName,
                            }),
                        })

                        router.replace('/show-scheduled-exam');
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
    try {
        let questionMetaData = context.query.metaData;
        if (!questionMetaData) {
            return { redirect: { destination: '/schedule-exam', permanent: false } }
        }
        questionMetaData = JSON.parse(questionMetaData);
        // console.log(questionMetaData);

        const { username, type } = getUserInfoFromRequest(context.req);
        const teacherUserName = username;
        if (type == "student") {
            return { redirect: { destination: '/login', permanent: false } }
        }
        const teacherDataResult = await runQuery(
            'SELECT * FROM TEACHERS WHERE "username"=:username',
            false,
            {
                username: teacherUserName,
            }
        );
        console.log(teacherDataResult.rows);
        if (teacherDataResult.rows[0].isVerified === "N") {
            console.log("Not verified");
            return { redirect: { destination: '/', permanent: false } }
        }
        let res = await runQueryFromFile('getTopicFromClass', false, {
            class: questionMetaData.class,
        });
        questionMetaData.topics = res.rows;
        questionMetaData.topicIds = res.rows.map((item) => {
            return item.topicId;
        });
        questionMetaData.teacherUserName = teacherUserName;
        console.log(questionMetaData);
        return {
            props: {
                questionMetaData
            }
        }
    } catch (e) {
        console.log(e);
        return { redirect: { destination: '/login', permanent: false } }
    }
}
