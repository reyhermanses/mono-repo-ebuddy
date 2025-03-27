"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, deleteUser } from "../../apis/userApi";
import { AppDispatch, RootState } from "../../store/store";
// import { User } from "@monrepo/shared/src/user";
import {
    Container,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { fetchUserSuccess } from "@/store/actions";
import UpdateButton from "@/components/UpdateButton";
import { logout } from "@/apis/authApi";

const UserPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data = [], loading, error } = useSelector((state: RootState) => state.user);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = (id: string) => {
        dispatch(deleteUser({ id }));
        dispatch(fetchUserSuccess({ data: data.filter((user: any) => user.id !== id) }));
    };

    // const handleLogout = () => {
    //     logout
    // }

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>User Information</Typography>
            <Box display="flex" gap={3} >
                <UpdateButton />
                <Button variant="outlined" onClick={logout}>Logout</Button>
            </Box>
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <Typography variant="h6">Loading data user...</Typography>
                </Box>
            )}
            {error && <Typography color="error">{error}</Typography>}
            {!error && !loading && data &&
                <Box paddingTop={5}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>ID</b></TableCell>
                                    <TableCell><b>Name</b></TableCell>
                                    <TableCell><b>Email</b></TableCell>
                                    <TableCell><b>Role</b></TableCell>
                                    <TableCell><b>Actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.role}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => alert(`View: ${row.name}`)}>
                                                <Visibility />
                                            </IconButton>
                                            <IconButton color="warning" onClick={() => alert(`Edit: ${row.name}`)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 50, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Box>
            }
        </Container>
    );
};

export default UserPage;