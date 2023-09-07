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

import styles from '@/styles/reg_login-form.module.css';
import { hashPassword } from '@/utils/hashPassword';
import { useRef, useState } from 'react';

const storage = getStorage();

export function StudentForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const fileIntputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [doneConfirmPassword, setDoneConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      institution: '',
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      if (values.password != confirmPassword) return;

      setErrorMessage('');

      const data = JSON.parse(JSON.stringify(values));
      data.password = hashPassword(values.password);

      for (const key in data) {
        if (data[key] == '') data[key] = null;
      }

      async function sendDataToDatabase() {
        const response = await axios.post('/api/createStudent', data);
        if (response.data.success) router.replace('/');
        else setErrorMessage(response.data.error);
      }

      const imageFile = fileIntputRef.current.files[0];

      if (imageFile) {
        const storageRef = ref(storage, 'images/' + values.username);
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
    <Container style={{ margin: '2em auto 0 auto' }}>
      <Form onSubmit={formik.handleSubmit} className={styles.form}>
        <Form.Control
          placeholder="Username"
          value={formik.values.username}
          name="username"
          onChange={formik.handleChange}
          required
        />
        <Form.Control
          type="password"
          placeholder="Password"
          value={formik.values.password}
          name="password"
          onChange={formik.handleChange}
          required
        />
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          name="password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          onBlur={() => setDoneConfirmPassword(true)}
          required
        />
        {doneConfirmPassword && formik.values.password != confirmPassword && (
          <Alert variant="danger">Password must match</Alert>
        )}
        <Form.Control
          placeholder="First Name"
          value={formik.values.firstName}
          name="firstName"
          onChange={formik.handleChange}
          required
        />
        <Form.Control
          placeholder="Last Name"
          value={formik.values.lastName}
          name="lastName"
          onChange={formik.handleChange}
        />
        <Form.Control
          placeholder="Instituition"
          value={formik.values.institution}
          name="institution"
          onChange={formik.handleChange}
        />
        <Form.Control
          placeholder="Email"
          value={formik.values.email}
          name="email"
          required
          onChange={formik.handleChange}
        />
        <Form.Group style={{ textAlign: 'left', display: 'flex' }}>
          <Form.Label style={{ marginRight: '1em' }}>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/jpeg, image/png"
            ref={fileIntputRef}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={
            doneConfirmPassword && formik.values.password != confirmPassword
          }
        >
          Register
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
