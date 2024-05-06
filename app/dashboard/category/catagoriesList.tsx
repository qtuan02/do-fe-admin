import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Data {
    id: string;
    name: string;
    createAt: string;
}

function createData(
    id: string,
    name: string,
    createAt: string,

): Data {
    return { id, name, createAt };
}

const rows = [
    createData('1', 'dien thoai', '1'),
    createData('2', 'may tinh', '1'),
    createData('3', 'xe dap', '1'),

];

export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='left'
                                style={{ minWidth: 70 }}
                            >
                                ID
                            </TableCell>
                            <TableCell
                                align='left'
                                style={{ minWidth: 170 }}
                            >
                                Category name
                            </TableCell>
                            <TableCell
                                align='left'
                                style={{ minWidth: 170 }}
                            >
                                Create at
                            </TableCell>
                            <TableCell
                                align='left'
                                style={{ minWidth: 170 }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell key={index} align='left'>
                                            {row.id}
                                        </TableCell>
                                        <TableCell key={index} align='left'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell key={index} align='left'>
                                            {row.createAt}
                                        </TableCell>
                                        <TableCell key={index} align='left'>
                                            <div className='flex'>
                                                <div className='cursor-pointer text-green-600 mr-2'>
                                                    <EditIcon />
                                                </div>
                                                <div className='cursor-pointer text-orange-600'>
                                                    <DeleteIcon />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
