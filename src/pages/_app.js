import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '@/utils/firebaseConfig';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Exam-Wiki</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link href="/exam">Practice Exam</Nav.Link>
              <Nav.Link href="/add-question">Add Question</Nav.Link>
              <Nav.Link href="/show-scheduled-exam">Scheduled Exams</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Component {...pageProps} />
    </>
  );
}
