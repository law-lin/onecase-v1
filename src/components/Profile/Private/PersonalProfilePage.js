import React, { Component } from "react";

import "../profile.css";

import Navbar from "../../Navbar";
import LeftNavbar from "../../LeftNavbar";

import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import Button from "@material-ui/core/Button";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../ProfileCard";
import LinksCard from "../LinksCard";
import Biography from "../Biography";
import Username from "../Username";
import Box from "@material-ui/core/Box";
import MediaQuery from "react-responsive";

import { withAuthorization } from "../../Session";
import BottomNavbar from "../../BottomNavbar";

class PersonalProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      oldBio: null,
      oldUsername: null,
      username: null,
      profilePicture: null,
      editing: false,
      canSave: false,
      canCancel: false,
      bio: null,
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    let username = this.props.match.params.username.toString().toLowerCase();

    if (!this.state.loading) {
      this.setState({
        loading: true,
      });
      this.props.firebase
        .getIDWithUsername(username)
        .on("value", (snapshot) => {
          const userIDState = snapshot.val();
          console.log(userIDState);
          if (userIDState) {
            this.setState({
              userID: userIDState,
            });
            this.props.firebase.user(userIDState).on("value", (snapshot) => {
              const state = snapshot.val();
              console.log(state);
              if (state) {
                this.setState({
                  oldUsername: state.username,
                  username: state.username,
                });
                if (state.bio) {
                  this.setState({
                    bio: state.bio,
                    oldBio: state.bio,
                  });
                } else {
                  this.setState({
                    bio: "Edit your bio with the edit button!",
                  });
                }
                if (state.profilePicture) {
                  this.setState({
                    profilePicture: state.profilePicture,
                  });
                } else {
                  this.setState({
                    profilePicture: DefaultProfilePicture,
                  });
                }
                this.setState({
                  loading: false,
                });
              } else {
                this.setState({
                  bio: "Edit your bio with the edit button!",
                  profilePicture: DefaultProfilePicture,
                  loading: false,
                });
              }
            });
          } else {
            this.setState({
              userID: null,
            });
          }
        });
    }
  }

  onUsernameChange = (value) => {
    this.setState({
      username: value,
    });
  };

  onBioChange = (value) => {
    this.setState({
      bio: value,
    });
  };

  handleEdit = () => {
    this.setState({
      editing: true,
      canSave: true,
      canCancel: true,
    });
  };

  handleSave = () => {
    const { username, oldUsername, bio, error } = this.state;
    let formattedUsername = username.toLowerCase();

    let valid = true;

    if (username === oldUsername) {
      if (bio != null) this.props.firebase.editBio(bio);
      this.setState({
        editing: false,
        canSave: false,
        canCancel: false,
      });
    } else {
      this.props.firebase
        .checkDuplicateUsername(formattedUsername)
        .on("value", (snapshot) => {
          const usernameRegexp = /^(?=.{1,20}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/;
          console.log(usernameRegexp.test(username));
          if (usernameRegexp.test(username)) {
            if (!snapshot.exists()) {
              this.setState({
                error: null,
              });
            } else {
              this.setState({
                error: "Username is already taken.",
              });
              valid = false;
            }
          } else {
            this.setState({
              error:
                "Please use only letters (a-z, A-Z), numbers, underscores, and periods. (1-30 characters)",
            });
            valid = false;
          }
          if (valid) {
            if (
              username !== oldUsername &&
              username !== "" &&
              username != null
            ) {
              this.props.firebase.editUsername(oldUsername, username);
              window.location.href = "/" + username;
            }

            if (bio != null) this.props.firebase.editBio(bio);
            this.setState({
              editing: false,
              canSave: false,
              canCancel: false,
            });
          }
        });
    }
  };

  handleCancel = () => {
    this.setState({
      username: this.state.oldUsername,
      bio: this.state.oldBio,
      editing: false,
      canSave: false,
      canCancel: false,
    });
  };

  render() {
    return (
      <div className="bg">
        <MediaQuery maxDeviceWidth={1224}>
          <Navbar />
          <Grid container style={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={3}>
                <Grid justify="center" container item xs={12} spacing={3}>
                  <React.Fragment>
                    <Grid container item xs={12}>
                      <Grid item xs={8}>
                        {!this.state.loading && (
                          <ProfilePicture
                            profilePicture={this.state.profilePicture}
                            editable={this.state.editing}
                          />
                        )}
                        {!this.state.loading && (
                          <Username
                            display="inline"
                            username={this.state.username}
                            editable={this.state.editing}
                            onChange={this.onUsernameChange}
                          />
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        {!this.state.editing && (
                          <Button onClick={this.handleEdit}>
                            Edit Profile
                          </Button>
                        )}
                        {this.state.editing && (
                          <Button onClick={this.handleSave}>Save</Button>
                        )}
                        {this.state.editing && (
                          <Button onClick={this.handleCancel}>Cancel</Button>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        {!this.state.loading && (
                          <Biography
                            margin="0px"
                            bio={this.state.bio}
                            editable={this.state.editing}
                            onChange={this.onBioChange}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        follow
                      </Grid>
                      <Grid item xs={12} align="right">
                        switch
                      </Grid>
                    </Grid>
                  </React.Fragment>
                </Grid>
                <Grid justify="center" container item xs={12} spacing={3}>
                  <React.Fragment>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card1"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card2"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card3"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card4"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card5"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card6"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card7"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card8"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card9"
                        editable={this.state.editing}
                      />
                    </Grid>
                  </React.Fragment>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
              <LinksCard />
            </Grid>
          </Grid>
          <BottomNavbar />
        </MediaQuery>
        <MediaQuery minDeviceWidth={1224}>
          <Navbar />
          <Grid container style={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={2}>
              <LeftNavbar />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={3}>
                <Grid
                  justify="center"
                  container
                  item
                  xs={12}
                  spacing={3}
                  style={{ minHeight: "20vh" }}
                >
                  <React.Fragment>
                    <Box clone order={{ xs: 2, sm: 1 }}>
                      <Grid item xs={12} sm={4}>
                        {!this.state.loading && (
                          <Biography
                            margin="25px"
                            bio={this.state.bio}
                            editable={this.state.editing}
                            onChange={this.onBioChange}
                          />
                        )}
                      </Grid>
                    </Box>
                    <Box clone order={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={4} align="center">
                        {!this.state.loading && (
                          <Username
                            username={this.state.username}
                            editable={this.state.editing}
                            onChange={this.onUsernameChange}
                          />
                        )}
                        {!this.state.loading && (
                          <ProfilePicture
                            profilePicture={this.state.profilePicture}
                            editable={this.state.editing}
                          />
                        )}
                      </Grid>
                    </Box>
                    <Box clone order={{ xs: 3, sm: 3 }}>
                      <Grid item xs={12} sm={4} align="center">
                        {!this.state.editing && (
                          <Button onClick={this.handleEdit}>
                            Edit Profile
                          </Button>
                        )}
                        {this.state.editing && (
                          <Button onClick={this.handleSave}>Save</Button>
                        )}
                        {this.state.editing && (
                          <Button onClick={this.handleCancel}>Cancel</Button>
                        )}
                        {this.state.error}
                      </Grid>
                    </Box>
                  </React.Fragment>
                </Grid>
                <Grid justify="center" container item xs={12} spacing={3}>
                  <React.Fragment>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card1"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card2"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card3"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card4"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card5"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card6"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card7"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card8"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card9"
                        editable={this.state.editing}
                      />
                    </Grid>
                  </React.Fragment>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
              <LinksCard />
            </Grid>
          </Grid>
        </MediaQuery>
      </div>
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalProfilePage);
