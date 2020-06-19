import React, { Component, Fragment } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withFirebase } from "./Firebase";
// Icons

class EditCard extends Component {
  state = {
    name: "",
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = () => {
    const { cardInfo } = this.state;
    this.props.firebase.editCard(cardInfo, this.props.cardNumber);
    this.handleClose();
  };
  render() {
    return (
      <div>
        {this.props.editable && (
          <Fragment>
            <Button tip="Edit Card" onClick={this.handleOpen}>
              EDIT CARD
            </Button>

            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Edit this card</DialogTitle>
              <DialogContent>
                <form>
                  <TextField
                    name="cardInfo"
                    tpye="text"
                    label="Card Info"
                    multiline
                    rows="1"
                    placeholder="Update card info"
                    value={this.state.username}
                    onChange={this.handleChange}
                    fullWidth
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.handleSubmit} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withFirebase(EditCard);
