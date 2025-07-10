import { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import Footer from '../Components/Footer';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

export default function Users() {
  const { user,guestUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password:'',
    adminPassword: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      if (user.password === newUserData.adminPassword) {
        const data = {
          name: newUserData.name,
          email: newUserData.email,
          password:newUserData.password
        };
  
        try {
          const response = await fetch(`${process.env.REACT_APP_URL}/api/user/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, data }),
          });
  
          if (response.ok) {
            toast.success("Added Successful!")
            handleCloseDialog();
            setNewUserData({name: '', email: '', password:'', adminPassword: ''});
            guestUser(data);
          }
        } catch (error) {
          console.log(error);
        }
      }else{
        console.log('failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSaveUser = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewUserData((prevState) => ({
      ...prevState,
      adminPassword: '',
    }));
  };

  return (
    <main className={`d-flex flex-column min-vh-100 fade-in ${isLoaded ? 'visible' : ''}`}>
      <ToastContainer/>
      <div className="container mt-4 pt6 flex-grow-1">
        <section>
          <h2 className="text-3xl font-weight-bold mb-4">User Management</h2>
        </section>

        <section>
          <div className="card mb-5 shadow border-0">
            <div className="card-body">
              <h5 className="card-title">Guest Users</h5>
              <p className="card-text text-muted">View and search guest users in your system.</p>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ maxWidth: '500px' }}
                />
              </div>
            </div>

            <div className="card-body">
              <TableContainer component={Paper}>
                <Table aria-label="guest users table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.guests
                      .filter((guest) =>
                        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((guest, index) => (
                        <TableRow key={index}>
                          
                          <TableCell>{guest.name}</TableCell>
                          <TableCell>{guest.email}</TableCell>
                          <TableCell>Guest</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </section>

        <section>
          <div className="card mb-5 shadow border-0 w-50">
            <div className="card-body">
              <h5 className="card-title">Add New User</h5>
              <p className="card-text text-muted">
                Fill in the details to add a new user to the system.
              </p>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <TextField
                  label="Username"
                  variant="standard"
                  fullWidth
                  value={newUserData.name}
                  onChange={(e) => {
                    setNewUserData((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Email"
                  variant="standard"
                  fullWidth
                  value={newUserData.email}
                  onChange={(e) => {
                    setNewUserData((prev) => ({ ...prev, email: e.target.value }));
                  }}
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Password"
                  variant="standard"
                  fullWidth
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => {
                    setNewUserData((prev) => ({ ...prev, password: e.target.value }));
                  }}
                />
              </div>

              <div className="d-flex mt-4 justify-content-start">
                <button
                  className="btn btn-success rounded-pill px-4"
                  onClick={handleSaveUser}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Dialog fullWidth open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter Admin Password"
            type="password"
            fullWidth
            variant="standard"
            value={newUserData.adminPassword}
            onChange={(e) => {
              setNewUserData((prev) => ({ ...prev, adminPassword: e.target.value }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </main>
  );
}
