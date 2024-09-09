import React, { useState } from "react";
import Chart from "react-apexcharts";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Grid,
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
// import CustomBreadcrumb from "../breadcrumb/CustomBreadcrumb";

const initialUsers = [
  {
    id: 1,
    name: "Mark Dsuza",
    age: 32,
    status: "Active",
    statusColor: "green",
    subscriptionType: "Clinician",
    clinician: "Dr. Smith",
    avatarSrc: "/placeholder-user.jpg",
    avatarFallback: "MD",
  },
  {
    id: 2,
    name: "Josef Jennyfer",
    age: 28,
    status: "Inactive",
    statusColor: "red",
    subscriptionType: "Clinician",
    clinician: "Dr. Doe",
    avatarSrc: "/placeholder-user.jpg",
    avatarFallback: "JJ",
  },
  {
    id: 3,
    name: "Romeo D custa",
    age: 40,
    status: "Active",
    statusColor: "green",
    subscriptionType: "Clinician",
    clinician: "Dr. Brown",
    avatarSrc: "/placeholder-user.jpg",
    avatarFallback: "RC",
  },
  {
    id: 4,
    name: "Anald Donald",
    age: 35,
    status: "Active",
    statusColor: "green",
    subscriptionType: "Portal",
    clinician: "Dr. Green",
    avatarSrc: "/placeholder-user.jpg",
    avatarFallback: "AD",
  },
  // Add more users as needed for testing pagination
  {
    id: 5,
    name: "David John",
    age: 29,
    status: "Inactive",
    statusColor: "red",
    subscriptionType: "Clinician",
    clinician: "Dr. Lee",
    avatarSrc: "/placeholder-user.jpg",
    avatarFallback: "DJ",
  },
  {
    id: 6,
    name: "Peter Parker",
    age: 25,
    status: "Inactive",
    statusColor: "red",
    subscriptionType: "Portal",
    clinician: "Dr. Watson",
    avatarSrc: "/placeholder-user.jpg",
    avatarFallback: "PP",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "green";
    case "Inactive":
      return "red";
    case "Pending":
      return "orange";
    default:
      return "gray";
  }
};

export default function Component() {
  const [users, setUsers] = useState(initialUsers);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: "",
      age: "",
      status: "",
      statusColor: "",
      subscriptionType: "",
      clinician: "",
      avatarSrc: "/placeholder-user.jpg",
      avatarFallback: "",
    };
    setSelectedUser(newUser);
    handleOpenModal("add");
  };

  const handleUpdateStatus = () => {
    handleOpenModal("edit");
    handleCloseMenu();
  };

  const handleDeletePatient = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    handleCloseMenu();
  };

  const handleSave = () => {
    const updatedUser = {
      ...selectedUser,
      statusColor: getStatusColor(selectedUser.status),
    };

    if (modalMode === "add") {
      setUsers([...users, updatedUser]);
    } else if (modalMode === "edit") {
      setUsers(
        users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    }
    handleCloseModal();
  };

  const barChartData = {
    series: [
      {
        name: "Active",
        data: [10, 15, 8, 18, 20, 12, 14], // Example data for each month
      },
      {
        name: "Inactive",
        data: [5, 3, 7, 2, 6, 4, 5], // Example data for each month
      },
      {
        name: "Pending",
        data: [2, 4, 1, 5, 3, 7, 6], // Example data for each month
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      colors: ["#4EE6C9", "#DC526C", "#87EF9D"], // Colors for Active, Inactive, and Pending
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "January", "February", "March", "April", "May", "June", "July"
        ], // Example months
      },
      yaxis: {
        title: {
          text: "Number of Patients",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} patients`,
        },
      },
      legend: {
        position: "bottom",
      },
    },
  };

  const doughnutChartData = {
    series: [
      users.filter((user) => user.status === "Active").length,
      users.filter((user) => user.status === "Inactive").length,
      users.filter((user) => user.status === "Pending").length,
    ],
    options: {
      chart: {
        type: "donut",
        height: 350,
      },
      labels: ["Active", "Inactive", "Pending"],
      // colors: ["#4caf50", "#be3b3b", "#FFC107"],
      colors: ["#4EE6C9", "#DC526C", "#87EF9D"],

      dataLabels: {
        enabled: true,
      },
      legend: {
        position: "bottom",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      <div className="page-header p-3">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-account fs-5"></i>
          </span> Patient Management
        </h3>
        {/* <CustomBreadcrumb /> Render the breadcrumb */}
        <span>
          Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
        </span>
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          px: 3,
        }}
      >
        <Grid container spacing={3} >
          <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Patient Status by Month" />
              <CardContent>
                <Chart
                  options={barChartData.options}
                  series={barChartData.series}
                  type="bar"
                  height={350}
                  width={650}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Patient Status Distribution" />
              <CardContent>
                <Chart
                  options={doughnutChartData.options}
                  series={doughnutChartData.series}
                  type="donut"
                  height={350}
                  width={480}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Patient Management Table"
                // action={
                //   <Button
                //     variant="contained"
                //     color="primary"
                //     startIcon={<AddIcon />}
                //     onClick={handleAddUser}
                //   >
                //     Add Patient
                //   </Button>
                // }
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Avatar</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Subscription Type</TableCell>
                        <TableCell>Clinician</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Avatar
                                src={user.avatarSrc}
                                alt={user.avatarFallback}
                              />
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.age}</TableCell>
                            <TableCell>
                              <Typography
                                style={{ color: user.statusColor }}
                              >
                                {user.status}
                              </Typography>
                            </TableCell>
                            <TableCell>{user.subscriptionType}</TableCell>
                            <TableCell>{user.clinician}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={(event) => handleClick(event, user)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                              >
                                <MenuItem onClick={handleUpdateStatus}>
                                  <UpdateIcon /> Edit
                                </MenuItem>
                                <MenuItem onClick={handleDeletePatient}>
                                  <DeleteIcon /> Delete
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={users.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </CardContent>
            </Card>
          </Grid>

          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  {modalMode === "add" ? "Add Patient" : "Edit Patient"}
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                label="Name"
                value={selectedUser?.name || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Age"
                value={selectedUser?.age || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, age: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Status"
                value={selectedUser?.status || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, status: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Subscription Type"
                value={selectedUser?.subscriptionType || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    subscriptionType: e.target.value,
                  })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Clinician"
                value={selectedUser?.clinician || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    clinician: e.target.value,
                  })
                }
                margin="normal"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleCloseModal} color="secondary" sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                  {modalMode === "add" ? "Add" : "Save"}
                </Button>
              </Box>
            </Box>
          </Modal>
        </Grid>
      </Box>
    </div>
  );
}
