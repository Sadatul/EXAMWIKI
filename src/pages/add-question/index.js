import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { runQueryFromFile } from '@/utils/runQuery';
import { useRouter } from 'next/router';

const initialQuestionMetaData = {
  class: '',
  subject: '',
  chapter: '',
  topic: '',
};

export default function AddQuestion({ repo }) {
  const topicInfo = repo.rows;
  // console.log(topicInfo);

  const [questionMetaData, setQuestionMetaData] = useState(
    initialQuestionMetaData
  );
  const router = useRouter();
  console.log(questionMetaData);

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
  if (questionMetaData.class != '') {
    for (let i = 0; i < topicInfo.length; i++) {
      if (topicInfo[i].class == questionMetaData.class) {
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
  if (questionMetaData.subject != '') {
    for (let i = 0; i < topicInfo.length; i++) {
      if (
        topicInfo[i].class == questionMetaData.class &&
        topicInfo[i].subject == questionMetaData.subject
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
  if (questionMetaData.chapter != '') {
    for (let i = 0; i < topicInfo.length; i++) {
      if (
        topicInfo[i].class == questionMetaData.class &&
        topicInfo[i].subject == questionMetaData.subject &&
        topicInfo[i].chapter == questionMetaData.chapter
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
        {/* <h1 className="mb-6 text-sky-600">SubjectInfo of Question</h1> */}
        <Form.Group className="m-2" controlId="class">
          <Form.Select
            aria-label="Default select example"
            id="eh-class" // eh = exam home
            onChange={(e) => {
              let tmp = { ...questionMetaData };
              tmp.class = e.target.value;
              tmp.subject = '';
              tmp.chapter = '';
              tmp.topic = '';
              setQuestionMetaData(tmp);
            }}
          >
            <option value="">Select Class</option>
            {classOptionList}
          </Form.Select>
        </Form.Group>
        <Form.Group
          className="m-2"
          key={'sb' + questionMetaData.class}
          controlId="subject"
        >
          <Form.Select
            aria-label="Default select example"
            id="eh-subject" // eh = exam home
            onChange={(e) => {
              let tmp = { ...questionMetaData };
              tmp.subject = e.target.value;
              tmp.chapter = '';
              tmp.topic = '';
              setQuestionMetaData(tmp);
            }}
            disabled={questionMetaData.class == ''}
          >
            <option value="">Select Subject</option>
            {subjectOptionList}
          </Form.Select>
        </Form.Group>
        <Form.Group
          className="m-2"
          key={'ch' + questionMetaData.subject}
          controlId="chapter"
        >
          <Form.Select
            aria-label="Default select example"
            id="eh-chapter" // eh = exam home
            onChange={(e) => {
              let tmp = { ...questionMetaData };
              tmp.chapter = e.target.value;
              tmp.topic = '';
              setQuestionMetaData(tmp);
            }}
            disabled={questionMetaData.subject == ''}
          >
            <option value="">Select Chapter</option>
            {chapterOptionList}
          </Form.Select>
        </Form.Group>
        <Form.Group
          className="m-2"
          key={'to' + questionMetaData.chapter}
          controlId="topic"
        >
          <Form.Select
            aria-label="Default select example"
            id="eh-topic" // eh = exam home
            onChange={(e) => {
              let tmp = { ...questionMetaData };
              tmp.topic = e.target.value;
              setQuestionMetaData(tmp);
            }}
            disabled={questionMetaData.chapter == ''}
          >
            <option value="">Select Topic</option>
            {topicOptionList}
          </Form.Select>
        </Form.Group>
        <div className="flex flex-row justify-end mr-3">
          <Button
            variant="primary"
            disabled={
              questionMetaData.chapter == '' ||
              questionMetaData.class == '' ||
              questionMetaData.subject == '' ||
              questionMetaData.topic == ''
            }
            onClick={() => {
              router.push({
                pathname: '/add-question/set-question',
                query: { questionMetaData: JSON.stringify(questionMetaData) },
              });
            }}
          >
            {' '}
            Confirm
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
  );
}

export const getStaticProps = async () => {
  const res = await runQueryFromFile('getAllTopics');
  const repo = {
    rows: res.rows,
  };
  return { props: { repo } };
};
