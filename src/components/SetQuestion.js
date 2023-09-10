import { Alert, Form, Button, ProgressBar } from 'react-bootstrap';
import _ from 'lodash';
import { useContext, useState } from 'react';
import {
  questionDataContext,
  setQuestionDataContext,
} from './addQuestionContext';
// question data is a list
// This form will save its data in questionData list index
// index will be fixed even if the previous one gets deleted.

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const storage = getStorage();

const initialQuestionObject = {
  deleted: false, // This is to add the feature of delete with lazy deletion
  body: '',
  options: [],
  image: '',
  answer: '',
  difficulty: -1,
};

// The questionObject on ith index will already exist no need to add it here
// It will be added in set-question-page.js
export default function SetQuestion({ index }) {
  const questionData = useContext(questionDataContext);
  const setQuestionData = useContext(setQuestionDataContext);

  const [startedUploading, setStartedUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const [optionE, setOptionE] = useState(false);

  if (questionData.deleted) {
    console.log('WORK');
    return <>1</>;
  }

  return (
    <div className="flex flex-row justify-center mt-5">
      <Form
        className="w-1/2 p-10 bg-slate-100 rounded-2xl shadow-2xl relative"
        spellCheck="false"
      >
        <Button
          variant="danger"
          className="absolute top-5 right-5"
          onClick={(e) => {
            let copied = _.cloneDeep(questionData);
            copied[index].deleted = true;
            setQuestionData(copied);
            // setOptionE(true);
          }}
        >
          X
        </Button>
        <p className="text-center">{index + 1}</p>
        <Form.Group style={{ margin: '1em 0', display: 'flex' }}>
          <Form.Label style={{ marginRight: '0.4em' }}>Image</Form.Label>
          <Form.Control
            type="file"
            onChange={async (e) => {
              const imageFile = e.target.files[0];

              if (imageFile) {
                const nextIdValue = await fetch('/api/getNextQuestionId');
                const { nextId } = await nextIdValue.json();

                const storageRef = ref(
                  storage,
                  'questions/' + (nextId + index)
                );
                setStartedUploading(true);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                uploadTask.on(
                  'state_changed',
                  (snapshot) => {
                    const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                    setUploadProgress(progress);
                  },
                  (error) => {
                    console.error(error);
                    setErrorMessage(
                      'Something went wrong while uploading your image. It could be a network issue'
                    );
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      (downloadURL) => {
                        console.log(downloadURL);
                        let copied = JSON.parse(JSON.stringify(questionData));
                        copied[index].image = downloadURL;
                        setQuestionData(copied);
                        setStartedUploading(false);
                        setUploadProgress(0);
                      }
                    );
                  }
                );
              }
            }}
          />
        </Form.Group>
        {uploadProgress != 0 && (
          <ProgressBar
            now={uploadProgress}
            label={`${parseInt(uploadProgress)}%`}
            variant="success"
            style={{ margin: '2em 2em' }}
          />
        )}
        {startedUploading && <div>Wait until the image is uploaded</div>}
        {!startedUploading && (
          <>
            <Form.Group
              key="body"
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              {/* <Form.Label>Question Body</Form.Label> */}
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Question Body"
                value={questionData[index].body}
                onChange={(e) => {
                  // console.log(questionData);
                  let copied = _.cloneDeep(questionData);
                  copied[index].body = e.target.value;
                  setQuestionData(copied);
                }}
              />
            </Form.Group>
            <Form.Group
              key="options"
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              {/* <Form.Label>Question Body</Form.Label> */}
              <Form.Control
                key="optionA"
                as="textarea"
                rows={1}
                placeholder="Option A"
                value={questionData[index].options[0]}
                onChange={(e) => {
                  console.log('insideOptionA');
                  console.log(questionData);
                  let copied = _.cloneDeep(questionData);
                  copied[index].options[0] = e.target.value;
                  setQuestionData(copied);
                }}
              />
              <Form.Control
                key="optionB"
                as="textarea"
                rows={1}
                placeholder="Option B"
                value={questionData[index].options[1]}
                onChange={(e) => {
                  let copied = _.cloneDeep(questionData);
                  copied[index].options[1] = e.target.value;
                  setQuestionData(copied);
                }}
              />
              <Form.Control
                key="optionC"
                as="textarea"
                rows={1}
                placeholder="Option C"
                value={questionData[index].options[2]}
                onChange={(e) => {
                  let copied = _.cloneDeep(questionData);
                  console.log(index);
                  console.log(questionData);
                  copied[index].options[2] = e.target.value;
                  setQuestionData(copied);
                }}
              />
              <Form.Control
                key="optionD"
                as="textarea"
                rows={1}
                placeholder="Option D"
                value={questionData[index].options[3]}
                onChange={(e) => {
                  let copied = _.cloneDeep(questionData);
                  copied[index].options[3] = e.target.value;
                  setQuestionData(copied);
                }}
              />
              <Form.Check // prettier-ignore
                type="switch"
                id={index + 'optinESwitch'}
                label="Toggle Option E"
                onChange={(e) => {
                  setOptionE(e.target.checked);
                  // optionE was true before and now it is false but it hasn't
                  // been updated yet. So we check for true
                  if (setOptionE && questionData[index].options.length == 5) {
                    let copied = _.cloneDeep(questionData);
                    copied[index].options.pop();
                    setQuestionData(copied);
                  }
                }}
              />
              {optionE ? (
                <Form.Control
                  key="optionE"
                  as="textarea"
                  rows={1}
                  placeholder="Option E"
                  value={questionData[index].options[4]}
                  onChange={(e) => {
                    let copied = _.cloneDeep(questionData);
                    if (copied[index].options.length == 4) {
                      copied[index].options.push(e.target.value);
                    } else {
                      copied[index].options[4] = e.target.value;
                    }
                    setQuestionData(copied);
                  }}
                />
              ) : (
                ''
              )}
            </Form.Group>

            <Form.Group
              key={'answer' + optionE}
              className="mb-3 flex flex-row gap-5"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Select
                aria-label="Default select example"
                id={index + 'answer'}
                value={questionData[index].answer}
                onChange={(e) => {
                  let copied = _.cloneDeep(questionData);
                  copied[index].answer = e.target.value;
                  setQuestionData(copied);
                }}
              >
                <option value="">Answer</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                {optionE ? <option value="E">E</option> : ''}
              </Form.Select>
              <Form.Select
                aria-label="Default select example"
                id={index + 'difficulty'}
                value={questionData[index].value}
                onChange={(e) => {
                  let copied = _.cloneDeep(questionData);
                  copied[index].difficulty = Number(e.target.value);
                  setQuestionData(copied);
                }}
              >
                <option value="">Difficulty</option>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </Form.Select>
            </Form.Group>
          </>
        )}
      </Form>

      {errorMessage.length != 0 && (
        <Alert variant="danger" style={{ margin: '2em 0' }}>
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}
