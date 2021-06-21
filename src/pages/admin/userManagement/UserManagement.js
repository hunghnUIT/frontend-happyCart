import React, { useEffect, useState } from "react";
import { Container, Row, } from "shards-react";
import { makeStyles } from '@material-ui/core/styles';
import {
  TableCell,
  TableRow,Table,
  TableContainer,
  Paper,
  TableBody,
  Checkbox,
  TablePagination,
} from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import PageTitle from "../../../components/common/PageTitle";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import adminApi from '../../../api/adminApi';
import { capitalizeFirstLetter } from '../../../helpers/helper';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function UserManagement() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Update data
  const [willUpdateUsers, setWillUpdateUsers] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredUsers.length - page * rowsPerPage);

  const handleDeleteUser = async () => {
    const len = selected.length;
    if (window.confirm(`Bạn sắp xóa ${len} người dùng ra khỏi CSDL. Hãy lưu ý những dữ liệu này sẽ KHÔNG THỂ KHÔI PHỤC. Bạn muốn tiếp tục?`)) {
      const confirmStr = `xóa ${len} người dùng`;
      let confirm = window.prompt(`Hãy nhập vào ô bên dưới "${confirmStr}" để xác nhận.`)
      if (confirm === confirmStr.toLowerCase()) {
        let succeedId = [];
        let failedId = [];
        for (const id of selected) {
          try {
            const resp = await adminApi.deleteUser(id);
            if (resp.success)
              succeedId.push(id);
          } catch (error) {
            console.log(error.message);
            failedId.push(id);
          }
        }

        const failedLen = failedId.length;
        if (failedLen && window.confirm(`Xóa thất bại ${failedLen} người dùng. Bạn có muốn thử lại?`)) {
          let countResult = 0;
          for (const id of failedId) {
            try {
              const resp = await adminApi.deleteUser(id);
              if (resp?.success) {
                succeedId.push(id);
                countResult += 1;
              }
            } catch (error) {
              console.log(error.message);
            }
          }

          if (countResult < failedLen)
            alert(`Không thể xóa ${failedLen - countResult} người dùng. Hãy thử lại sau.`)
        }
        if (succeedId.length)
          alert(`Đã xóa xong ${succeedId.length} người dùng`);

        setSelected([]);
        setWillUpdateUsers(true);
      }
      else if (confirm !== null && confirm !== confirmStr.toLowerCase())
        alert('Câu lệnh xác nhận chưa đúng.')
    }
  };

  const handleSearchUser = (term) => {
    const result = users.filter((user, idx) => {
      return ((user?.name).toLowerCase()?.includes(term) || (user?.email).toLowerCase()?.includes(term))
    });
    setFilteredUsers(result);
  }

  const RenderNoteCell = (props) => { 
    if (props.info.isAuthByThirdParty) {
      return (<TableCell align="center">Đăng nhập sử dụng {capitalizeFirstLetter(props.info.provider)}</TableCell>)
    }
    // else if()
    else
      return (<TableCell align="center"></TableCell>)
  }

  useEffect(() => {
    if (willUpdateUsers || !users.length) {
      adminApi.getUsers().then(resp => {
        if (resp.success) {
          setUsers(resp.data);
          setFilteredUsers(resp.data);
        }
      }).catch(err => console.log(err.message))
    }

    setWillUpdateUsers(false);
  }, [willUpdateUsers]) //eslint-disable-line

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Người dùng" subtitle="Quản lý" className="text-sm-left" />
      </Row>
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          onClickDelete={handleDeleteUser} 
          onChangeUserSearchBar={(value) => {handleSearchUser(value)}}
          tableTitle='Danh sách người dùng'
          unit='người dùng'
          searchPlaceHolder='Tìm theo tên, email'
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredUsers.length}
            />
            <TableBody>
              {stableSort(filteredUsers, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell align="center">{new Date(row.createdAt).toLocaleDateString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' })}</TableCell>
                      <TableCell align="center">{row.isVerified ? <CheckCircleIcon style={{color: 'green'}}/> : <CancelIcon style={{color: 'red'}}/>}</TableCell>
                      <RenderNoteCell info={row}/>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
    </Container>
  );
}

export default UserManagement;