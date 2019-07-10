import React, { Component } from 'react';
import { Tabs, Tab, Thumbnail, Image, Grid, Row, Col, Modal, Button, ListGroup, ListGroupItem, Navbar, Nav, NavItem } from "react-bootstrap";
import "./Dashboard.css";
import Container from "../../components/Container";
import API from "../../utils/API";
import { FormBtn, TextArea, Input } from "../../components/Form";
import { getFromStorage, setInStorage } from '../../utils/localstorage';
import axios from "axios";
import api from '../../utils/API';

// import Navbar from "../../components/Navbar";
//import backimg from "../../images/dashboard-background.jpg";


class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.getUserObject = this.getUserObject.bind(this);
    this.collabproject = this.collabproject.bind(this);
    this.getAllSaved = this.getAllSaved.bind(this);
    this.handleShowUpdate = this.handleShowUpdate.bind(this);
    this.handleShowGigsters = this.handleShowGigsters.bind(this);
    this.handleGigHide = this.handleGigHide.bind(this);
    this.handleUpdateHide = this.handleUpdateHide.bind(this);
    this.approveProject = this.approveProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);

    this.state = {
      username: "",
      isAuthenticated: false,
      key: 1,
      show: false,
      showupdate: false,
      showgigsters: false,
      msg: '',
      github: '',
      myprojects: [],
      saved: [],
      showId: null,
      updateid: null,
      gigid: null,
      user: [],
      collabprojects: [],
      title: "",
      description: "",
      location: "",
      startDate: null,
      endDate: null,
      imageUrl: "",
      message: "",
      amount: Number,
      deleteId: null
    };
  }

  componentWillMount() {
    //this.getUserObject();

  }

  componentDidMount() {

    // this.getAllSaved();
    this.getUserObject();

  };

  dataUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelect(key) {
    this.setState({ key });
  }

  handleShow = (id) => {

    this.setState({ show: true, showId: id });
  }
  handleShowUpdate = (id) => {


    const showMyProject = this.state.myprojects.filter(myproject => myproject._id == id);

    let obj = Object.assign({}, showMyProject[0]);

    console.log(obj);
    this.setState({
      showupdate: true,
      title: obj.title,
      location: obj.location,
      description: obj.description,
      updateid: id

    })
  }


  handleUpdateSubmit = () => {

    let updatedProject = {
      title: this.state.title,
      location: this.state.location,
      description: this.state.description,
      id: this.state.updateid


    }

    API.updateProject(updatedProject).then(res => window.location.reload());




  }
  handleShowGigsters = (id) => {
    this.setState({ gigid: id, showgigsters: true });
  }

  handleHide = () => {
    this.setState({ show: false, github: "", msg: "" });
  }

  handleUpdateHide = () => {
    this.setState({ showupdate: false });
  }

  handleGigHide = () => {
    this.setState({ showgigsters: false });
  }

  handleDeleteID = (id) => {
    console.log(id);
    API.deleteProject(id).then(res => this.getUserObject());



  }

  getUserObject = () => {

    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {

      const { token } = obj;

      axios.get("/api/auth/account/verify?token=" + token)

        .then(res => {
          console.log(res)
          if (res.data.status == "good") {

            this.setState({ token });


            let userId = res.data.userId;
            console.log(userId);
            let username = res.data.username;
            console.log(res.data);
            API.getUserProjects(userId)
              .then(res => {
                console.log(res);
                console.log(res.data.data);



                if (res) {
                  this.setState({
                    myprojects: res.data.data,
                    username: username,
                    collabedProjects : res.data.data.gigsters

                  })

                }

                console.log(this.state.myprojects);
                this.getAllProjects(userId)
                // console.log(this.state.description);

                // console.log(this.state.collabprojects);

              }).catch(err => console.log(err));
            // then(() => {
            //   // console.log(this.state.user._id)
            //   this.getAllSaved(this.state.user._id);

            // }).catch(err => console.log(err));

          }
        })
    }

  };


  // search all projects spits all the database projects  
  getAllSaved = () => {


    // let id = userId.toString();
    console.log('here');
    // console.log(id);
    API.getdbProjects()
      .then(res => {
        console.log(res.data.data);
        //  const response = res.filter(filteredObj =>  filteredObj);
        let response = res.data.data;
        console.log(response);
        // let newArray = response.filter(obj => obj.userId !== userId)
        // console.log(newArray)

        this.setState({
          saved: response
        });
        //console.log(response);  
        // console.log(this.state.user._id);
        //const response = res.data.search;

        // console.log(this.state.saved);
      })
      .catch(err => console.log(err));
  };


  getAllProjects = (userId) => {

    // let id = userId.toString();
    console.log('here');
    // console.log(id);
    API.getdbProjects()
      .then(res => {
        console.log(res.data.data);

        let CollabProjectIds = [];

        API.collabedProjects(userId).then((projectIds => {

          console.log(projectIds.data);
          let col = projectIds.data.map ( collab => collab.projectId);

          console.log(col);

          CollabProjectIds = projectIds.data;

          console.log(CollabProjectIds);
          let newArray;
        
      
            // newArray = res.data.data.filter(obj => obj.userId !== userId);
          // projects id are not the collaboration project ids
        
          newArray = res.data.data.filter(obj => obj.userId !== userId);
          console.log(newArray);

      

        //  col.map(id => {  console.log(id)  });
          
        
       
          console.log(newArray)
          this.setState({
            saved: newArray,
            collabprojects: col
          });

    
          //  console.log(response);  
          //  console.log(this.state.user._id);
          //  const response = res.data.search;

          //  console.log(this.state.saved);
        }))
      })
      .catch(err => console.log(err));

  }



  //collaboration projects
  collabproject = () => {

    // e.preventDefault();

    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {

      const { token } = obj;

      axios.get("/api/auth/account/verify?token=" + token)

        .then(response => {
          console.log(response)
          if (response.data.status == "good") {


      
            console.log("response sent")
            const gigster = {
              notifications: this.state.msg,
              userId: response.data.userId,
              username : this.state.username,
              projectId: this.state.showId,
              github: this.state.github
            }
            console.log(gigster);
            API.collabProject(gigster)
              .then(res => {
                // not doing anything with the response

                console.log(res);

                console.log(res.data);



                //let response = res.data.collaboration.collaborations;


                this.setState({
                  msg: "",
                  github: "",
    
                  collabprojects: res.data


                })


                console.log(this.state.collabprojects);

              })
              .catch(err => console.log(err));

          }
        })
    }

  };

  //project approval

  approveProject = () => {
    let id = "";

    this.state.myprojects.forEach(myprojects => {
      myprojects.forEach(myproject => {
        myproject.gigster.forEach(myproject => {
          id = myproject._id
        })
      })
    });

    API.approveProject(id).then(res => {
      console.log(res);
    })
  };

  deleteProject = () => {
    //let pId = this.state.showId;
    const deleteIdProject = this.state.deleteId;
    console.log(deleteIdProject);
    API.deleteProject(deleteIdProject).then(res => console.log("deleted Successfully"));
  }

  dataChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };



  logout = (e) => {

    e.preventDefault();


    const obj = getFromStorage('the_main_app');

    console.log(obj);
    if (obj && obj.token) {

      const { token } = obj;

      axios.get("/api/auth/account/verify?token=" + token)

        .then(res => {
          console.log(res);
          if (res.data.status === "good") {
            console.log("dashboard");

            localStorage.removeItem('the_main_app');
            return this.props.history.push("/");

            // this.setState({
            //     // token : "",
            //     isLoading: false
            // });
          } else {

          }
        });
    } else {
      this.setState({
        isLoading: false
      })

    }
  }


  render() {






    let showItem = this.state.saved.filter(item => item._id === this.state.showId);

    // const showMyProject = this.state.myprojects.filter(myproject => myproject._id == this.state.updateid);

    // let obj = Object.assign({},showMyProject[0]);


    // const showGigProject = this.state.myprojects.map(myprojects => myprojects.filter(myprojects => myprojects._id === this.state.gigid))
    // console.log(showMyProject)

    // console.log(showMyProject.map(project => project.map(project => project.title)));


    return (
      <div>
        {!this.state.isAuthenticated ?
          (<Navbar inverse collapseOnSelect className="navbar">
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/dashboard" style={{ color: "white", textDecoration: "none", hover: "color: '#009999'" }}>Welcome, {this.state.username}</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <NavItem href="/dashboard">
                  Dashboard
              </NavItem>
                <NavItem href="/AddProject">
                  AddProject
              </NavItem>
                <NavItem onClick={this.logout}>
                  Logout
              </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>) :
          (
            window.location.href("/"),
            localStorage.removeItem('user')
          )}

        <div className="dashboard-style">
          <Container>
            <Tabs
              activeKey={this.state.key}
              onSelect={this.handleSelect}
              id="controlled-tab-example"
              className="tab-style"
              bsStyle="pills"
            >
              <Tab eventKey={1} title="My Projects">
                <Grid>
                  <br></br>
                  <Row>
                    {this.state.myprojects.length ? (
                      <div className="flexContainer">
                        {this.state.myprojects.map((myprojects => {
                          console.log(myprojects)
                          return (
                            <Thumbnail className="flexThumbnail">
                              <Image src={myprojects.imageUrl} thumbnail />
                              <h5>{myprojects.title}</h5>
                              <p>Location: {myprojects.location}</p>
                              <p>Description: {myprojects.description}</p>
                              <Button className="btn" onClick={() => this.handleShowUpdate(myprojects._id)} style={{ float: "left" }}>Update</Button>
                              <br></br>
                              <Button className="btn" onClick={() => this.handleDeleteID(myprojects._id)} style={{ float: "right" }}>Delete</Button>
                              <br></br>
                              <br></br>
                              <Button className="btn" onClick={() => this.handleShowGigsters(myprojects._id)}>Requests From Collaborations</Button>

                              
                            </Thumbnail>
                          )
                        }
                        ))}

                      </div>
                    ) : (<h3 style={{ color: "white" }}>You Haven't Created any Gig yet. </h3>)}
                  </Row>
                </Grid>
              </Tab>
              <Tab eventKey={2} title="My Collaborations">
                <Grid>
                  <Row>
                    {this.state.collabprojects ? (
                      <div className="flexContainer">
                        {this.state.collabprojects.map(myprojects => (
                          <Thumbnail className="flexThumbnail">
                            <Image src={myprojects.imageUrl} thumbnail />
                            <h5>{myprojects.title}</h5>
                            <p>Location: {myprojects.location}</p>
                            <p>Description: {myprojects.description}</p>

                            <h5>status : pending</h5>

                            <br></br>

                          </Thumbnail>
                        ))}

                      </div>
                    ) : (<h3 style={{ color: "white" }}>No Collaborations made yet</h3>)}
                  </Row>
                </Grid>
              </Tab>
              <Tab eventKey={3} title="Other Projects">
                <Grid>
                  <Row>
                    {this.state.saved.length ? (
                      <div className="flexContainer">
                        {this.state.saved.map((saved) => {

                          return (
                            <Thumbnail className="flexThumbnail">
                              <Image src={saved.imageUrl} thumbnail />
                              <h5>{saved.title}</h5>
                              <p>Location: {saved.location}</p>
                              <p>Description: {saved.description}</p>
                              <Button onClick={() => this.handleShow(saved._id)}>Want to Collaborate?</Button>
                            </Thumbnail>
                          )
                        })}

                      </div>
                    ) : (
                        <h3>No projects </h3>
                      )}
                  </Row>
                </Grid>
              </Tab>
            </Tabs>
            {/* all projects AKA MODEL 1 */}

            <Modal
              {...this.props}
              // this activates it to show based if show = true in the state
              show={this.state.show}
              id={this.state.showId}
              onHide={this.handleHide}
              dialogClassName="custom-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">
                  {showItem && <p key={showItem._id}>{showItem.title}</p>}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {showItem && showItem._id == this.state.showId}
                {showItem && <label key={showItem._id}>
                  Send Message:
                    <TextArea
                    value={this.state.msg}
                    onChange={this.dataChange.bind(this)}
                    name="msg"
                    placeholder="Your Message Goes Here"
                    required
                    style={{width: "500px"}}
                  >
                  </TextArea>
    
                  <Input
                    value={this.state.github}
                    onChange={this.dataChange.bind(this)}
                    type="url"
                    placeholder="Github Profile"
                    name="github"
                    required />
                </label>}
                <FormBtn onClick={() => this.collabproject()}>Submit</FormBtn>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => this.handleHide()}>Close</Button>
              </Modal.Footer>
            </Modal>

            {/* //render myproject to update */}

            <Modal
              {...this.props}
              show={this.state.showupdate}
              id={this.state.myprojects._id}
              onHide={this.handleUpdateHide}
              dialogClassName="custom-modal"
            >
              <Modal.Header closeButton>


                <Modal.Title id="contained-modal-title-lg">


                  {/* {showMyProject && <p key={project._id}>{project.title}</p>} */}



                  <label>Title:</label>

                  <Input
                    name="title"
                    value={this.state.title}
                    onChange={this.dataUpdate.bind(this)}
                  />

                </Modal.Title>

              </Modal.Header>
              <Modal.Body>



                <div>

                  <label>Location:</label>
                  <Input
                    name="location"
                    value={this.state.location}
                    onChange={this.dataUpdate.bind(this)}
                  />


                  <label>Description:</label>
                  <Input
                    name="description"
                    value={this.state.description}
                    onChange={this.dataUpdate.bind(this)}
                  />

                </div>


                <FormBtn onClick={this.handleUpdateSubmit}>Submit</FormBtn>
                <br></br>
                <br></br>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleUpdateHide}>Close</Button>
              </Modal.Footer>
            </Modal>

            {/* check gigter request */}
             <Modal

              {...this.props}
              show={this.state.showgigsters}
              id={this.state.myprojects._id}
              onHide={this.handleGigHide}
              dialogClassName="custom-modal"
              className="model-2"
            >
              <Modal.Header closeButton>
                {this.state.myprojects.map(project => {

                  console.log(project);

                return (
                  <Modal.Title id="contained-modal-title-lg">
                   
                  </Modal.Title>
                )
                })}
              </Modal.Header>
              <Modal.Body>
                {this.state.myprojects.map(project => project.gigster.map(gigster => {
                
           console.log(gigster);
                return (
                  <div>
                    {gigster.projectId == this.state.gigid ? (
                      <label >
                     
                <ListGroup style={{width:"500px", textAlign:"center"}}>
                          <ListGroupItem>
                          <h4>Hey! <a href="https://github.com/MJ3132" target="_blank">{gigster.username}</a> wants to collab: </h4>
                            <p>{gigster.notifications}</p>
                            <p>{gigster.github}</p>
                            <span><Button onClick={() => this.approveProject()}>Approve</Button>&nbsp; &nbsp;
                            <Button type="button">Decline</Button></span>
                          </ListGroupItem>
                        </ListGroup>
                      </label>
                    )
                      : (<h2>No Requests Yet</h2>)}
                  </div>
                )
                       
                }))}

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleGigHide}>Close</Button>
              </Modal.Footer>
            </Modal> 

          </Container>
        </div>
      </div>
    );
  }
}

export default Dashboard;