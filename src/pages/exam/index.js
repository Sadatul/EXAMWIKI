import Link from 'next/link'
import { Form } from 'react-bootstrap';
import { useState } from 'react';

const initialExamData = {
    class: "",
    subject: "",
    questionCount: 20,
    chapter: -1,
    topic: -1,
    difficulty: 1,
};

const subjects = ["Bangla", "English"];

export default function examHome() {

    const [examData, setExamData] = useState(initialExamData);
    console.log(examData);

    return (
        <div>
            <Form>
                <Form.Group controlId="difficult">
                    <Form.Label className='mr-10'>Select Difficulty</Form.Label>
                    <Form.Select className=" border-2 border-gray-700" aria-label="Default select example"
                        id='eh-difficulty' // eh = exam home
                        onChange={(e) => {
                            let tmp = { ...examData };
                            tmp.difficulty = Number(e.target.value);
                            setExamData(tmp);
                        }}>
                        <option value="1">Easy</option>
                        <option value="2">Medium</option>
                        <option value="3">Hard</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="questionCount">
                    <Form.Label className='mr-10'>Select Question Count</Form.Label>
                    <Form.Select className=" border-2 border-gray-700" aria-label="Default select example"
                        id='eh-questionCount' // eh = exam home
                        onChange={(e) => {
                            let tmp = { ...examData };
                            tmp.questionCount = Number(e.target.value);
                            setExamData(tmp);
                        }}>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="100">100</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="class">
                    <Form.Label className='mr-10'>Select Class</Form.Label>
                    <Form.Select className=" border-2 border-gray-700" aria-label="Default select example"
                        id='eh-class' // eh = exam home
                        onChange={(e) => {
                            let tmp = { ...examData };
                            tmp.questionCount = Number(e.target.value);
                            setExamData(tmp);
                        }}>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="100">100</option>
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