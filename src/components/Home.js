import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/Home">EncrypTrade</Navbar.Brand>
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/Home">Home</Nav.Link>
          <Nav.Link as={Link} to="/Register">Register</Nav.Link>
          <Nav.Link as={Link} to="/UserLogin">User Login</Nav.Link>
          <Nav.Link as={Link} to="/AdminRegistration">AdminRegistration</Nav.Link>
          

          <Nav.Link as={Link} to="/AdminLogin">Admin Login</Nav.Link>
          
            
          </Nav>
        </Container>
      </Navbar>
      
    </>
  );
}

export default Home;
