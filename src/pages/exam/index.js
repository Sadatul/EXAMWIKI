import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { runQueryFromFile } from '@/utils/runQuery';
import { useRouter } from 'next/router';

const initialExamData = {
  questionCount: -1,
  difficulty: -1,
  class: '',
  subject: '',
  chapter: '',
  topic: '',
};

const subjects = ['Bangla', 'English'];

export default function examHome({ repo }) {
  const topicInfo = repo.rows;
  // console.log(topicInfo);

  const [examData, setExamData] = useState(initialExamData);
  const router = useRouter();
  console.log(examData);

  // Repo stores the entire topic info table.
  // Now will extract data using normal JS.

  // Extracting all unique the classes from the topicInfo table.
  let classList = new Set();
  for (let i = 0; i < topicInfo.length; i++) {
    classList.add(topicInfo[i].class);
  }
  let classOptionList = [];
  let i = 0;
  for (let item of classList) {
    classOptionList.push(
      <option key={i++} value={item}>
        {item}
      </option>
    );
  }

  // Extracting all unique the subjects from the topicInfo table under the currently selected class.
  let subjectList = new Set();
  let subjectOptionList = [];
  if (examData.class != '') {
    for (let i = 0; i < topicInfo.length; i++) {
      if (topicInfo[i].class == examData.class) {
        subjectList.add(topicInfo[i].subject);
      }
    }
    let i = 0;
    for (let item of subjectList) {
      subjectOptionList.push(
        <option key={i++} value={item}>
          {item}
        </option>
      );
    }
  }

  let chapterList = new Set();
  let chapterOptionList = [];
  if (examData.subject != '') {
    for (let i = 0; i < topicInfo.length; i++) {
      if (
        topicInfo[i].class == examData.class &&
        topicInfo[i].subject == examData.subject
      ) {
        chapterList.add(topicInfo[i].chapter);
      }
    }
    let i = 0;
    for (let item of chapterList) {
      chapterOptionList.push(
        <option key={i++} value={item}>
          {item}
        </option>
      );
    }
  }

  let topicList = new Set();
  let topicOptionList = [];
  if (examData.chapter != '') {
    for (let i = 0; i < topicInfo.length; i++) {
      if (
        topicInfo[i].class == examData.class &&
        topicInfo[i].subject == examData.subject &&
        topicInfo[i].chapter == examData.chapter
      ) {
        topicList.add(topicInfo[i].topic);
      }
    }
    let i = 0;
    for (let item of topicList) {
      topicOptionList.push(
        <option key={i++} value={item}>
          {item}
        </option>
      );
    }
  }
  return (
    <div className="flex flex-row justify-center mt-5">
      <Form className="w-1/2 p-10 bg-slate-100 rounded-2xl shadow-2xl shadow-sky-500">
        <h1 className="mb-6 text-sky-600">Test Your Self</h1>
        <p className="mb-6 text-red-600 text-center">Only student accounts are permitted to take practice exams.
          <br />
          Teacher accounts will be automatically redirected to the login page</p>
        <Form.Group className="m-2" controlId="difficult">
          <Form.Select
            aria-label="Default select example"
            id="eh-difficulty" // eh = exam home
            onChange={(e) => {
              let tmp = { ...examData };
              tmp.difficulty = Number(e.target.value);
              setExamData(tmp);
            }}
          >
            <option value="-1">Select Difficulty Level</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="m-2" controlId="questionCount">
          <Form.Select
            aria-label="Default select example"
            id="eh-questionCount" // eh = exam home
            onChange={(e) => {
              let tmp = { ...examData };
              tmp.questionCount = Number(e.target.value);
              setExamData(tmp);
            }}
          >
            <option value="-1">Select Question Count</option>
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="100">100</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="m-2" controlId="class">
          <Form.Select
            aria-label="Default select example"
            id="eh-class" // eh = exam home
            onChange={(e) => {
              let tmp = { ...examData };
              tmp.class = e.target.value;
              tmp.subject = '';
              tmp.chapter = '';
              tmp.topic = '';
              setExamData(tmp);
            }}
          >
            <option value="">Select Class</option>
            {classOptionList}
          </Form.Select>
        </Form.Group>
        <Form.Group className="m-2" key={'sb' + examData.class} controlId="subject">
          <Form.Select
            aria-label="Default select example"
            id="eh-subject" // eh = exam home
            onChange={(e) => {
              let tmp = { ...examData };
              tmp.subject = e.target.value;
              tmp.chapter = '';
              tmp.topic = '';
              setExamData(tmp);
            }}
            disabled={examData.class == ''}
          >
            <option value="">Select Subject</option>
            {subjectOptionList}
          </Form.Select>
        </Form.Group>
        <Form.Group key={'ch' + examData.subject} className="m-2" controlId="chapter">
          <Form.Select
            aria-label="Default select example"
            id="eh-chapter" // eh = exam home
            onChange={(e) => {
              let tmp = { ...examData };
              tmp.chapter = e.target.value;
              tmp.topic = '';
              setExamData(tmp);
            }}
            disabled={examData.subject == ''}
          >
            <option value="">Select Chapter</option>
            {chapterOptionList}
          </Form.Select>
        </Form.Group>
        <Form.Group key={'to' + examData.chapter} className="m-2" controlId="topic">
          <Form.Select
            aria-label="Default select example"
            id="eh-topic" // eh = exam home
            onChange={(e) => {
              let tmp = { ...examData };
              tmp.topic = e.target.value;
              setExamData(tmp);
            }}
            disabled={examData.chapter == ''}
          >
            <option value="">Select Topic</option>
            {topicOptionList}
          </Form.Select>
        </Form.Group>
        <div className="flex flex-row justify-end mr-3">
          <Button
            variant="primary"
            disabled={
              examData.difficulty == -1 ||
              examData.questionCount == -1 ||
              examData.chapter == '' ||
              examData.class == '' ||
              examData.subject == '' ||
              examData.topic == ''
            }
            onClick={() => {
              router.push({
                pathname: '/exam/practice',
                query: { examData: JSON.stringify(examData) },
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
                    query: { examData: 'my-post' },
                }}
            ></Link> */}

      {/* <Exam examData={examData} /> */}
    </div>
  );
}

export const getStaticProps = async () => {
  const res = await runQueryFromFile('getAllTopics');
  const repo = {
    rows: res.rows,
  };
  return { props: { repo } };
};
