import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  BugReport,
  Search,
  FilterList,
  Edit,
  CheckCircle,
  Schedule,
  Error,
  AdminPanelSettings,
  School,
  TrendingUp,
  Assignment,
  Done,
  Pending,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Mock complaint data
  const mockComplaints = [
    {
      id: 'COMP001',
      title: 'Broken Chair in Computer Lab',
      description: 'Chair number 15 in computer lab 2 is broken and needs immediate replacement.',
      category: 'Infrastructure',
      department: 'Computer Science',
      priority: 'high',
      status: 'pending',
      submittedBy: 'student@college.com',
      submittedAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      attachments: ['chair_photo.jpg']
    },
    {
      id: 'COMP002',
      title: 'Air Conditioning Not Working',
      description: 'AC in room 301 is not cooling properly. Temperature is too high.',
      category: 'Infrastructure',
      department: 'Mechanical Engineering',
      priority: 'medium',
      status: 'in_progress',
      submittedBy: 'student@college.com',
      submittedAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      attachments: []
    },
    {
      id: 'COMP003',
      title: 'WiFi Connection Issues',
      description: 'WiFi signal is very weak in the library area. Need better coverage.',
      category: 'IT Services',
      department: 'Information Technology',
      priority: 'high',
      status: 'resolved',
      submittedBy: 'student@college.com',
      submittedAt: '2024-01-13T11:45:00Z',
      updatedAt: '2024-01-17T16:30:00Z',
      attachments: ['wifi_signal.jpg']
    },
    {
      id: 'COMP004',
      title: 'Water Leak in Chemistry Lab',
      description: 'There is a water leak from the ceiling in chemistry lab 1.',
      category: 'Infrastructure',
      department: 'Chemistry',
      priority: 'high',
      status: 'pending',
      submittedBy: 'student@college.com',
      submittedAt: '2024-01-12T08:15:00Z',
      updatedAt: '2024-01-12T08:15:00Z',
      attachments: ['leak_photo.jpg']
    },
    {
      id: 'COMP005',
      title: 'Projector Not Working',
      description: 'Projector in room 205 is not displaying properly. Screen is blurry.',
      category: 'IT Services',
      department: 'Electrical Engineering',
      priority: 'medium',
      status: 'in_progress',
      submittedBy: 'student@college.com',
      submittedAt: '2024-01-11T13:20:00Z',
      updatedAt: '2024-01-15T10:45:00Z',
      attachments: []
    }
  ];

  useEffect(() => {
    // Load complaints from localStorage or use mock data
    const savedComplaints = localStorage.getItem('complaints');
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    } else {
      // Initialize with mock data
      setComplaints(mockComplaints);
      localStorage.setItem('complaints', JSON.stringify(mockComplaints));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter complaints based on search and filters
    let filtered = complaints;

    // Filter by user role
    if (user?.role === 'student') {
      filtered = filtered.filter(complaint => complaint.submittedBy === user.email);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter);
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, statusFilter, priorityFilter, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Error />;
      case 'medium': return <Schedule />;
      case 'low': return <CheckCircle />;
      default: return <Assignment />;
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    setUpdateLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedComplaints = complaints.map(complaint =>
        complaint.id === selectedComplaint.id
          ? { ...complaint, status: newStatus, updatedAt: new Date().toISOString() }
          : complaint
      );

      setComplaints(updatedComplaints);
      localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
      setUpdateDialogOpen(false);
      setSelectedComplaint(null);
      setNewStatus('');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatistics = () => {
    const userComplaints = user?.role === 'student' 
      ? complaints.filter(c => c.submittedBy === user.email)
      : complaints;

    return {
      total: userComplaints.length,
      pending: userComplaints.filter(c => c.status === 'pending').length,
      inProgress: userComplaints.filter(c => c.status === 'in_progress').length,
      resolved: userComplaints.filter(c => c.status === 'resolved').length,
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {user?.role === 'admin' ? (
                <AdminPanelSettings color="primary" />
              ) : (
                <School color="primary" />
              )}
              <Typography variant="h6" color="text.secondary">
                Welcome, {user?.name || 'User'} ({user?.role === 'admin' ? 'Administrator' : 'Student'})
              </Typography>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2">
                        Total Complaints
                      </Typography>
                    </Box>
                    <Assignment sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.pending}
                      </Typography>
                      <Typography variant="body2">
                        Pending
                      </Typography>
                    </Box>
                    <Pending sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.inProgress}
                      </Typography>
                      <Typography variant="body2">
                        In Progress
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.resolved}
                      </Typography>
                      <Typography variant="body2">
                        Resolved
                      </Typography>
                    </Box>
                    <Done sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search Complaints"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    className="cursor-target"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      startAdornment={<FilterList sx={{ mr: 1, color: 'action.active' }} />}
                      className="cursor-target"
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      label="Priority"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      startAdornment={<FilterList sx={{ mr: 1, color: 'action.active' }} />}
                      className="cursor-target"
                    >
                      <MenuItem value="all">All Priorities</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="cursor-target"
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Complaints ({filteredComplaints.length})
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Submitted</TableCell>
                      {user?.role === 'admin' && <TableCell>Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {complaint.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {complaint.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {complaint.description.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={complaint.category} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getPriorityIcon(complaint.priority)}
                            label={complaint.priority.toUpperCase()}
                            color={getPriorityColor(complaint.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={complaint.status.replace('_', ' ').toUpperCase()}
                            color={getStatusColor(complaint.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(complaint.submittedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        {user?.role === 'admin' && (
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setNewStatus(complaint.status);
                                setUpdateDialogOpen(true);
                              }}
                              className="cursor-target"
                            >
                              <Edit />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Update Status Dialog */}
          <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Complaint: {selectedComplaint?.title}
              </Typography>
              <FormControl fullWidth>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="cursor-target"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleStatusUpdate}
                variant="contained"
                disabled={updateLoading}
                className="cursor-target"
              >
                {updateLoading ? <CircularProgress size={20} /> : 'Update'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Container>
  );
};

export default Dashboard; 