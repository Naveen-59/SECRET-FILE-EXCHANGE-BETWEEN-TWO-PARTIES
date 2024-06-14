import Nav from 'react-bootstrap/Nav';

function AdminDashboard() {
  return (
    <Nav variant="pills" defaultActiveKey="/upload-file" style={{ backgroundColor: 'black', border: '1px solid black', borderRadius: '5px', padding: '5px' }}>
      <Nav.Item style={{ backgroundColor: 'black', border: '1px solid black', borderRadius: '5px', margin: '5px' }}>
        <Nav.Link href="/UploadData" style={{ color: 'white' }}>UploadData</Nav.Link>
      </Nav.Item>
      <Nav.Item style={{ backgroundColor: 'black', border: '1px solid black', borderRadius: '5px', margin: '5px' }}>
        <Nav.Link href="/DisplayFiles" style={{ color: 'white' }}>DisplayFiles</Nav.Link>
      </Nav.Item>
      <Nav.Item style={{ backgroundColor: 'black', border: '1px solid black', borderRadius: '5px', margin: '5px' }}>
        <Nav.Link href="/ViewRequests" style={{ color: 'white' }}>View Requests</Nav.Link>
      </Nav.Item>
      <Nav.Item style={{ backgroundColor: 'black', border: '1px solid black', borderRadius: '5px', margin: '5px' }}>
        <Nav.Link href="/AdminLogout" style={{ color: 'white' }}>Admin Logout</Nav.Link>
      </Nav.Item>
      <Nav.Item style={{ backgroundColor: 'black', border: '1px solid black', borderRadius: '5px', margin: '5px' }}>
        <Nav.Link href="/Contact" style={{ color: 'white' }}>Contact</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default AdminDashboard;
