import React, { Component, Fragment } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import { withStyles } from "@material-ui/core/styles";
import { withFirebase } from "./Firebase";
// Icons

const styles = () => ({
  root: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: "100px",
  },
  input: {
    fontSize: "36px",
  },
  input1: {
    fontFamily: "Montserrat",
    color: "#0FA9FF",
    fontSize: "24px",
  },
  input2: {
    fontFamily: "Montserrat",
    color: "#FF0000",
    fontSize: "24px",
  },
  input3: {
    fontFamily: "Montserrat",
    color: "#137212",
    fontSize: "24px",
  },
  input4: {
    fontFamily: "Montserrat",
    color: "#FF9900",
    fontSize: "24px",
  },
  input5: {
    fontFamily: "Montserrat",
    color: "#000000",
    fontSize: "24px",
  },
});

class EditBridgeCard extends Component {
  state = {
    name: "",
    open: false,
    cardNumber: null,
    cardImage: null,
    bridgeCardNumber: null,
    bridgeCardTitle: null,
    yearCreated: null,
    isProud: null,
    coworkers: null,
    whyMake: null,
    description: null,
    imageLoading: true,
    imagePreviewURL: null,
  };

  componentDidMount() {
    this.setState({
      cardNumber: this.props.cardNumber,
      bridgeCardNumber: this.props.bridgeCardNumber,
      bridgeCardTitle: this.props.bridgeCardTitle,
    });
  }
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

  handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let cardImage = e.target.files[0];

    console.log(cardImage);
    reader.onloadend = () => {
      this.setState({
        cardImage,
        imagePreviewURL: reader.result,
      });
    };

    reader.readAsDataURL(cardImage);
  };

  handleSubmit = () => {
    const {
      cardImage,
      bridgeCardTitle,
      cardNumber,
      bridgeCardNumber,
      yearCreated,
      isProud,
      coworkers,
      whyMake,
      description,
    } = this.state;
    console.log(cardNumber);
    this.props.firebase.editBridgeCard(
      cardNumber,
      bridgeCardNumber,
      bridgeCardTitle,
      yearCreated,
      isProud,
      coworkers,
      whyMake,
      description
    );

    this.props.firebase.uploadCardImage(cardImage).on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...

        console.log(cardImage);
        this.props.firebase.uploadCardImageURL(
          this.props.cardNumber,
          this.props.bridgeCardNumber,
          cardImage
        );
      }
    );
    this.handleClose();
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.props.editable && (
          <Fragment>
            <Button tip="Edit Bridge Card" onClick={this.handleOpen}>
              EDIT BRIDGE CARD
            </Button>

            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              fullWidth={true}
              maxWidth={"lg"}
            >
              <DialogTitle>
                <TextField
                  name="bridgeCardTitle"
                  type="text"
                  placeholder="Ex: Amazing Art, Vivid Views"
                  InputProps={{
                    className: classes.input,
                    disableUnderline: true,
                  }}
                  multiline
                  rows={1}
                  rowsMax={2}
                  styles={{ height: 500 }}
                  defaultValue={this.props.bridgeCardTitle}
                  value={this.state.bridgeCardTitle}
                  onChange={this.handleChange}
                  fullWidth
                />
              </DialogTitle>
              <DialogContent dividers>
                <Typography
                  style={{
                    color: "#0FA9FF",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  Year created:
                </Typography>
                <TextField
                  name="yearCreated"
                  type="text"
                  placeholder="Ex: 1990, 2020"
                  rowsMax={1}
                  InputProps={{
                    className: classes.input1,
                    disableUnderline: true,
                  }}
                  styles={{
                    fontWeight: 700,
                    height: 500,
                    fontColor: "#0FA9FF",
                  }}
                  defaultValue={this.props.yearCreated}
                  value={this.state.yearCreated}
                  onChange={this.handleChange}
                  fullWidth
                />
                <Typography
                  style={{
                    color: "#FF0000",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  Am I proud of this?
                </Typography>
                <TextField
                  name="isProud"
                  type="text"
                  placeholder="Ex: No, Possibly, Yes"
                  rowsMax={1}
                  InputProps={{
                    className: classes.input2,
                    disableUnderline: true,
                  }}
                  styles={{ height: 500 }}
                  defaultValue={this.props.isProud}
                  value={this.state.isProud}
                  onChange={this.handleChange}
                  fullWidth
                />
                <Typography
                  style={{
                    color: "#137212",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  People I worked with:
                </Typography>
                <TextField
                  name="coworkers"
                  type="text"
                  placeholder="Ex: John Doe, Jane Doe"
                  rows={2}
                  rowsMax={2}
                  multiline
                  styles={{ height: 500 }}
                  InputProps={{
                    className: classes.input3,
                    disableUnderline: true,
                  }}
                  defaultValue={this.props.coworkers}
                  value={this.state.coworkers}
                  onChange={this.handleChange}
                  fullWidth
                />
                <Typography
                  style={{
                    color: "#FF9900",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  Why'd I make it?{" "}
                </Typography>
                <TextField
                  name="whyMake"
                  type="text"
                  placeholder="Ex: For a school project, For fun"
                  rows={2}
                  rowsMax={2}
                  multiline
                  InputProps={{
                    className: classes.input4,
                    disableUnderline: true,
                  }}
                  styles={{ height: 500 }}
                  defaultValue={this.props.whyMake}
                  value={this.state.whyMake}
                  onChange={this.handleChange}
                  fullWidth
                />
                <Typography
                  style={{
                    color: "#000000",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  Description
                </Typography>
                <TextField
                  name="description"
                  type="text"
                  placeholder="Ex: Describe what you did"
                  rows={4}
                  rowsMax={4}
                  multiline
                  styles={{ height: 500 }}
                  InputProps={{
                    className: classes.input5,
                    disableUnderline: true,
                  }}
                  defaultValue={this.props.description}
                  value={this.state.description}
                  onChange={this.handleChange}
                  fullWidth
                />
                <div>
                  <input
                    type="file"
                    id={this.props.cardNumber}
                    style={{ display: "none" }}
                    onChange={this.handleImageChange}
                  />
                  <label htmlFor={this.props.cardNumber}>
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Upload Image
                    </Button>
                  </label>
                </div>

                <img src={this.state.imagePreviewURL} />
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

export default withFirebase(withStyles(styles)(EditBridgeCard));
