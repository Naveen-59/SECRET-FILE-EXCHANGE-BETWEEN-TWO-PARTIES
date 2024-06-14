import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function UserAdminboard() {
  return (
    <Navbar bg="dark" variant="light">
      <Nav className="mr-auto">
        <Nav.Link href="/ViewFiles">View Files</Nav.Link>
     
      </Nav>
      <Nav>
        
        <Nav.Link href="/UserLogout">User Logout</Nav.Link>
    
      </Nav>
      <Nav>
        <Nav.Link href="/Contact">Contact</Nav.Link>
    
      </Nav>
      <style>
        {`
          .navbar {
            background-color: black;
            border: 1px solid black;
            border-radius: 5px;
            margin: 5px;
          }
          .nav-link {
            color: white !important;
          }
        `}
      </style>
    </Navbar>
  );
}

export default UserAdminboard;
