import React, { Component } from "react";
import { TextArea, Input, FormBtn } from "../../components/Form";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import Container from "../../components/Container";
import Button from "../../components/Button";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import API from "../../utils/API";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getFromStorage, setInStorage } from '../../utils/localstorage';

import "./AddProject.css";



const labStyle = {
  fontSize: "15px",
  color: "#45A29E"
}


class AddProject extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username : "",
      show: false,
      title: "",
      description: "",
      location: "",
      startDate: null,
      endDate: null,
      imageUrl: "",
      message: "",
      loading: false,
      amount: Number,
      user: []
    }
  }

  componentWillMount() {
    this.getUserObject();
  }


  getUserObject = () => {
    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {

      const { token } = obj;

      axios.get("/api/auth/account/verify?token=" + token)

        .then(res => {
          console.log(res)
          if (res.data.status == "good") {

            this.setState({ token,
              username: res.data.username

            
            });


            let userId = res.data.userId;
            console.log(userId);
          };

        })
    }
  }

  handleChange = ({ startDate, endDate }) => {
    startDate = startDate || this.state.startDate
    endDate = endDate || this.state.endDate
    if (startDate.isAfter(endDate)) {
      endDate = startDate
    }

    this.setState({ startDate, endDate })
  }

  handleStart = (startDate) => {
    this.handleChange({ startDate })
  }

  handleEnd = (endDate) => {
    this.handleChange({ endDate })
  }

  dataChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  }


  handleLocationChange = address => {
    this.setState({ location: address });
  };
  createProject = (e) => {

    e.preventDefault();


    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {

      const { token } = obj;

      axios.get("/api/auth/account/verify?token=" + token)

        .then(res => {
          console.log(res)
          if (res.data.status == "good") {

            this.setState({ token });


            let clientId = res.data.userId;
            console.log(userId);

            const title = this.state.title
            const description = this.state.description
            const location = this.state.location
            const startDate = this.state.startDate
            const endDate = this.state.endDate
            const imageUrl = this.state.imageUrl
            const amount = this.state.amount
            const userId = clientId

            const userInput = {
              title,
              description,
              location,
              startDate,
              endDate,
              imageUrl,
              amount,
              userId
            }
            console.log(userInput);
            console.log(userId);
            API.createProject(userInput)
              .then(res => {
                console.log(res);
                window.location.href = "/dashboard";
              })

              .catch(err => {
                this.setState({
                  loading: false
                })
              })


          };

        })
    }

  }

  handleShowRadioChange = () => {
    this.setState({
      show: true
    });
  }

  handleHideRadioChange = () => {
    this.setState({
      show: false
    })
  }

  loadOrShowMsg = () => {
    if (this.state.loading) {
      return <p> Loading... </p>
    }
    else {
      return <p>{this.state.message}</p>
    }
  }

  render() {

    return (
      <div>

        <Navbar inverse collapseOnSelect className="navbar">
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>Welcome, {this.state.username}</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight className="nav-style">
              <NavItem href="/dashboard">
                Dashboard
              </NavItem>
              <NavItem href="/AddProject">
                AddProject
              </NavItem>
              <NavItem href="/">
                Logout
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>



        <Container>
          <div className="col-md-6 col-md-offset-3">
            <form onSubmit={this.createProject.bind(this)} >
              <h3 style={{ fontWeight: "bold", fontSize: "35px", color: "#66fcf1", textShadow: "1px 2px #004d4d" }}>Enter Project Information</h3>
              <label style={labStyle}>
                Title:
                    <Input
                  value={this.state.title}
                  name="title"
                  placeholder="Title (Required)"
                  onChange={this.dataChange.bind(this)}
                  type="text"
                  size="100"
                  required
                />
              </label>
              <br></br>
              <label style={labStyle}>
                Description:
                    <TextArea
                  value={this.state.description}
                  onChange={this.dataChange.bind(this)}
                  name="description"
                  placeholder="Description (Required, maximum 1000 Characters)"
                  rows="8"
                  cols="120"
                  type="text"
                  maxLength="1000"
                  required
                />
              </label>
              <br></br>
              <label style={labStyle}>
                Location:

                <PlacesAutocomplete
                  value={this.state.location}
                  onChange={this.handleLocationChange.bind(this)}
                  onSelect={this.handleSelect.bind(this)}

                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: 'Enter Postal Code',
                          className: 'location-search-input',
                        })}
                      />

                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </label>
              <br></br>
              <br></br>
              <label style={labStyle}>
                Start Date:
                <br></br>
                <DatePicker
                  className="rounded p-1"
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleStart}
                  placeholderText="MM/DD/YYYY"
                  required
                />
              </label>
              <br></br>
              <br></br>
              <label style={labStyle}>
                End Date:
                <br></br>
                <DatePicker
                  className="rounded p-1"
                  selected={this.state.endDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleEnd}
                  placeholderText="MM/DD/YYYY"
                  required
                />
              </label>
              <br></br>
              <br></br>
              <label style={labStyle}>
                Image:
                    <Input
                  name="imageUrl"
                  onChange={this.dataChange.bind(this)}
                  value={this.state.imageUrl}
                  type="url" placeholder="Enter Image URL" required
                  size="100"
                />
              </label>
              <br></br>
              <div>
                <label style={labStyle}>
                  <h4>Compensation: </h4>
                  {
                    this.state.show ?
                      <label>
                        Budget per Gigster:
                          <Input
                          value={this.state.amount}
                          onChange={this.dataChange.bind(this)}
                          type="number" name="amount"
                          min="1"
                          size="100"
                        />
                      </label>
                      : null
                  }
                  <Button type="button" onClick={() => this.handleShowRadioChange()}>Paid?</Button> {' '}
                  <Button type="button" onClick={() => this.handleHideRadioChange()}>Not Paid?</Button>
                </label>
              </div>
              <br></br>
              <FormBtn className="btnSubmit">
                Post
              </FormBtn>
            </form>

            {this.loadOrShowMsg()}
          </div>
        </Container>
      </div>
    )
  }
}

export default AddProject;