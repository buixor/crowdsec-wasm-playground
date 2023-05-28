import { TableContainer } from "@mui/material";
import { Component } from "react";
import { Paper } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableBody } from "@mui/material";
import { Button } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { TextField } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { Collapse } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';




class GrokLibrary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			patterns: window.getGrokPatterns(),
      search: '',
      patternsOpenState: {},
		};
	}

	async componentDidMount() {
	}

  updateSearch(event) {
    this.setState({ search: event.target.value });
  }

  handleOpen(key) {
    console.log("Opening ", key)
    console.log("State: ", this.state.patternsOpenState)


    //this.setState({ patternsOpenState: {[key]: true} });

    this.setState(prevState => ({
      patternsOpenState: {
        ...prevState.patternsOpenState,
        [key]: true,
      },
    }));
  }
  
  handleClose(key) {
    console.log("Closing ", key)
    console.log("State: ", this.state.patternsOpenState)
    //this.setState({ patternsOpenState: {[key]: false} });

    this.setState(prevState => ({
      patternsOpenState: {
        ...prevState.patternsOpenState,
        [key]: false,
      },
    }));
  }

	handleInputChange = (event) => {
		this.setState({
		  [event.target.name]: event.target.value,
		});
	  }
	
	  handleOpenDialog = () => {
		this.setState({
		  dialogOpen: true,
		});
	  }
	
	  handleCloseDialog = () => {
		this.setState({
		  dialogOpen: false,
		});
	  }
	
	  addPattern = () => {
		const { newPatternKey, newPatternValue } = this.state;
		if (newPatternKey && newPatternValue) {
      window.addPattern(newPatternKey, newPatternValue);
		  this.setState(prevState => ({
			patterns: {
			  ...prevState.patterns,
			  [newPatternKey]: newPatternValue,
			},
			newPatternKey: '',
			newPatternValue: '',
			dialogOpen: false,
		  }));
		}
	  }
	
	  deletePattern = (key) => {
		this.setState(prevState => {
		  let patterns = {...prevState.patterns};
		  delete patterns[key];
		  return {patterns};
		});
	  }

	render() {
    let filteredPatterns = Object.keys(this.state.patterns).filter(
      (key) => {
        return key.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }
    );
		return (
			<div>
			<h1>Grok Pattern Library</h1>
			<Button 
          onClick={this.handleOpenDialog}
          variant="contained"
          color="primary"
        >
          Add Pattern
        </Button>
        <Dialog open={this.state.dialogOpen} onClose={this.handleCloseDialog}>
          <DialogTitle>Add New Pattern</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the key and value for the new pattern.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="newPatternKey"
              value={this.state.newPatternKey}
              onChange={this.handleInputChange}
              label="Pattern Key"
              fullWidth
            />
            <TextField
              margin="dense"
              name="newPatternValue"
              value={this.state.newPatternValue}
              onChange={this.handleInputChange}
              label="Pattern Value"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.addPattern} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <TextField
          name="search"
          value={this.state.search}
          onChange={this.updateSearch.bind(this)}
          label="Search Patterns"
          fullWidth
        />
        <TableContainer component={Paper}>
          <div style={{ height: "700px", overflow: "auto" }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pattern</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatterns.sort().map((key, index) => (
                <>
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => this.state.patternsOpenState[key] === true ? this.handleClose(key) : this.handleOpen(key)}
                >
                  <TableCell component="th" scope="row">
                  <IconButton
      aria-label="expand row"
      size="small"
      onClick={(event) => {
        event.stopPropagation();
        this.state.patternsOpenState[key] ? this.handleClose(key) : this.handleOpen(key);
      }}
    >
      <ExpandMoreIcon 
        style={{
          transform: this.state.patternsOpenState[key] ? 'rotate(0deg)' : 'rotate(270deg)',
          transition: 'transform 0.1s',
        }}
      />
    </IconButton>
                    {key}
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      onClick={(event) => {event.stopPropagation(); this.deletePattern(key)}}
                      variant="contained"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={this.state.patternsOpenState[key]} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <Typography variant="body1" gutterBottom component="div">
                  {this.state.patterns[key]}
                  </Typography>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
          </div>
        </TableContainer>
			</div>
		);
	}
}

export default GrokLibrary;