import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  root: {
    width: '100%',
    padding: 30
  },
  table: {
    minWidth: 400,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  progressbar: {
    position: 'relative', paddingLeft: 45, listStyle: 'none'
  },
  stepGreen: {
    backgroundColor: 'rgba(0, 147, 69, 0.6)'
  },
  stepRed: {
    backgroundColor: 'red'
  }

});

class ToBeAllocatedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'timestamp',
    selected: [],
    data: [

    ],
    vessel: "",
    container: "",
    page: 0,
    rowsPerPage: 5,
  };

  setData(v1, v2) {
    if(v1 == 'Container') {
      this.setState({ container: v2.container });
      fetch('/api/queries/getTasksForContainer?vesselParam='+v2.container, {
            method: 'get',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            }
      }).then(res => res.json())
      .then((res) => {
         this.setState({ data: res });
      }) 
    } else {
      this.setState({ vessel: v2.vessel });
      fetch('/api/queries/getTasksForVessel?vesselParam='+v2.vessel, {
            method: 'get',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            }
      }).then(res => res.json())
      .then((res) => {
         this.setState({ data: res });
      })      
    }    
  }

  componentDidMount() {
    const { searchType, searchVal } = this.props;
    if(searchVal.query.container != undefined || searchVal.query.vessel != undefined) {
      this.setData(searchType, searchVal.query);
    }    
  }

  componentWillReceiveProps(newProps) {
    const { searchType, searchVal } = newProps;
    const { vessel, container } = this.state;
    if(searchType == 'Container') {
      if(searchVal.query.container != undefined && searchVal.query.container != container) {
        this.setData(searchType, searchVal.query);
      }
    } else {
      if(searchVal.query.vessel != undefined && searchVal.query.vessel != vessel) {
        this.setData(searchType, searchVal.query);
      }
    }
  }

  render() {
    const { classes, clickStep } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div>
        { data.length > 0 && <Paper className={classes.root}>
            <ol className={classes.progressbar} data-progress-steps={data.length}>
              <div style={{display: 'inline-block', content: '""', position: 'absolute', top: 0, left: '3.5px', width: 25, borderRadius: 25, height: 'calc(100%)', backgroundColor: '#bafc9c'}} />
                {data.map(row => {
                  return (
                    <li onClick={(e)=>{clickStep(row)}} style={{cursor:'pointer', paddingBottom: 15, minHeight: 55, position: 'relative', counterIncrement: 'list'}}><div>
                    {row.taskID} {row.finished == "true" && `(${row.completed_at})` }</div><div>
                    <div className={row.finished == "true" ? classes.stepGreen : classes.stepRed} style={{borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%', borderTopLeftRadius: '50%', borderTopRightRadius: '50%', boxSizing: 'border-box', color: 'rgb(0, 147, 69)', content: '""', display: 'block', fontSize: 10, height: 18, left: '-38px', paddingTop: 2, position: 'absolute', textAlign: 'center', top: '3.5px', width: 19}} />
                    </div>
                    </li>
                  );
                },this)}
            </ol>
          {/* <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          /> */}
        </Paper> }
      </div>
    );
  }
}

ToBeAllocatedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ToBeAllocatedTable);