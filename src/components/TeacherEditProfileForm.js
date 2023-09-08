import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form, Container, Alert, ProgressBar } from 'react-bootstrap';

import { useRouter } from 'next/router';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import { hashPassword } from '@/utils/hashPassword';
import { useRef, useState } from 'react';

const storage = getStorage();

export function TeacherEditProfileForm({ info }) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const fileIntputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [doneConfirmPassword, setDoneConfirmPassword] = useState(false);

  const [changePassword, setChangePassword] = useState(false);
  const [changeImage, setChangeImage] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: info.firstname,
      lastname: info.lastname,
      previousPassword: '',
      instituition: info.instituition,
      email: info.email,
      password: '',
      class: info.class,
      subject: info.subject,
    },

    onSubmit: async (values) => {
      if (changePassword && values.password != confirmPassword) return;

      setErrorMessage('');

      const data = JSON.parse(JSON.stringify(values));
      data.changeImage = changeImage;
      data.username = info.username;
      data.password = changePassword ? hashPassword(values.password) : null;
      data.previousPassword = hashPassword(values.previousPassword);
      for (const key in data) {
        if (data[key] == '') data[key] = null;
      }

      async function sendDataToDatabase() {
        const response = await axios.post('/api/updateTeacher', data);
        if (response.data.success) router.replace(`/profile/${info.username}`);
        else setErrorMessage(response.data.error);
      }

      const imageFile = fileIntputRef.current.files[0];

      if (imageFile) {
        const storageRef = ref(storage, 'images/' + info.username);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error(error);
            setErrorMessage(
              'Something went wrong while uploading your image. It could be a network issue'
            );
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              data.image = downloadURL;
              setUploadProgress(0);
              sendDataToDatabase();
            });
          }
        );
      } else {
        data.image = null;
        await sendDataToDatabase();
      }
    },
  });

  return (
    <Container>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label>Firstname</Form.Label>
          <Form.Control
            value={formik.values.firstname}
            name="firstname"
            onChange={formik.handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Lastname</Form.Label>
          <Form.Control
            value={formik.values.lastname ? formik.values.lastname : ''}
            name="lastname"
            onChange={formik.handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            value={formik.values.previousPassword}
            name="previousPassword"
            onChange={formik.handleChange}
            required
          />
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Change password"
          value={changePassword}
          onChange={(event) => setChangePassword(event.target.checked)}
        />
        <Form.Group>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            disabled={!changePassword}
            type="password"
            value={formik.values.password}
            name="password"
            onChange={formik.handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            disabled={!changePassword}
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onBlur={() => setDoneConfirmPassword(true)}
            required
          />
        </Form.Group>
        {changePassword &&
          doneConfirmPassword &&
          formik.values.password != confirmPassword && (
            <Alert variant="danger">Password must match</Alert>
          )}
        <Form.Group>
          <Form.Label>Instituition</Form.Label>
          <Form.Control
            value={formik.values.instituition ? formik.values.instituition : ''}
            name="instituition"
            onChange={formik.handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={formik.values.email}
            name="email"
            onChange={formik.handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Class</Form.Label>
          <Form.Control
            value={formik.values.class ? formik.values.class : ''}
            name="class"
            onChange={formik.handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Subject</Form.Label>
          <Form.Control
            value={formik.values.subject ? formik.values.subject : ''}
            name="subject"
            onChange={formik.handleChange}
          />
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Change image"
          value={changeImage}
          onChange={(event) => setChangeImage(event.target.checked)}
        />
        <Form.Group style={{ textAlign: 'left' }}>
          <Form.Label style={{ marginRight: '1em' }}>Image</Form.Label>
          <Form.Control
            type="file"
            disabled={!changeImage}
            accept="image/jpeg, image/png"
            ref={fileIntputRef}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="success"
          style={{ marginTop: '2em' }}
          disabled={
            changePassword &&
            doneConfirmPassword &&
            formik.values.password != confirmPassword
          }
        >
          Submit
        </Button>
      </Form>

      {uploadProgress != 0 && (
        <ProgressBar
          now={uploadProgress}
          label={`${parseInt(uploadProgress)}%`}
          variant="success"
          style={{ margin: '2em 2em' }}
        />
      )}

      {errorMessage.length != 0 && (
        <Alert variant="danger" style={{ margin: '2em 0' }}>
          {errorMessage}
        </Alert>
      )}
    </Container>
  );
}
