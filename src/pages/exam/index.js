import Link from 'next/link'
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { runQueryFromFile } from '@/utils/runQuery';

const initialExamData = {
    questionCount: -1,
    difficulty: -1,
    class: "",
    subject: "",
    chapter: "",
    topic: "",
};

const subjects = ["Bangla", "English"];

export default function examHome({ repo }) {
    const topicInfo = repo.rows;
    // console.log(topicInfo);

    const [examData, setExamData] = useState(initialExamData);
    console.log(examData);

    // Repo stores the entire topic info table.
    // Now will extract data using normal JS.

    // Extracting all unique the classes from the topicInfo table.
    let classList = new Set();
    for (let i = 0; i < topicInfo.length; i++) {
        classList.add(topicInfo[i].class);
    }
    let classOptionList = [];
    for (let item of classList) {
        classOptionList.push(<option value={item}>{item}</option>);
    }

    // Extracting all unique the subjects from the topicInfo table under the currently selected class.

    let subjectList = new Set();
    let subjectOptionList = [];
    if (examData.class != "") {
        for (let i = 0; i < topicInfo.length; i++) {
            if (topicInfo[i].class == examData.class) {
                subjectList.add(topicInfo[i].subject);
            }
        }
        for (let item of subjectList) {
            subjectOptionList.push(<option value={item}>{item}</option>);
        }
    }

    return (
        <div>
            <Form>
                <Form.Group controlId="difficult">
                    <Form.Select aria-label="Default select example"
                        id='eh-difficulty' // eh = exam home
                        onChange={(e) => {
                            let tmp = { ...examData };
                            tmp.difficulty = Number(e.target.value);
                            setExamData(tmp);
                        }}>
                        <option value="-1">Select Difficulty Level</option>
                        <option value="1">Easy</option>
                        <option value="2">Medium</option>
                        <option value="3">Hard</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="questionCount">
                    <Form.Select aria-label="Default select example"
                        id='eh-questionCount' // eh = exam home
                        onChange={(e) => {
                            let tmp = { ...examData };
                            tmp.questionCount = Number(e.target.value);
                            setExamData(tmp);
                        }}>
                        <option value="-1">Select Question Count</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="100">100</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="class">
                    <Form.Select aria-label="Default select example"
                        id='eh-class' // eh = exam home
                        onChange={(e) => {
                            let tmp = { ...examData };
                            tmp.class = e.target.value;
                            tmp.subject = "";
                            tmp.chapter = "";
                            tmp.topic = "";
                            setExamData(tmp);
                        }}>
                        <option value="">Select Class</option>
                        {classOptionList}
                    </Form.Select>
                </Form.Group>
                <Form.Group key={examData.class} controlId="subject">
                    <Form.Select aria-label="Default select example"
                        id='eh-subject' // eh = exam home
                        onChange={(e) => {
                            let tmp = { ...examData };
                            tmp.subject = e.target.value;
                            tmp.chapter = "";
                            tmp.topic = "";
                            setExamData(tmp);
                        }} disabled={examData.class == ""}>
                        <option value="">Select Subject</option>
                        {subjectOptionList}
                    </Form.Select>
                </Form.Group>
            </Form>
            <Link
                href={{
                    pathname: '/exam/practice',
                    query: { examData: 'my-post' },
                }}
            >Go to Exam</Link>
            {/* <Exam examData={examData} /> */}
        </div>
    )
}

export const getStaticProps = async () => {
    const res = await runQueryFromFile('getAllTopics');
    const repo = {
        rows: res
    }
    return { props: { repo } }
}