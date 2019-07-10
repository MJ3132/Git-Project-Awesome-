import React, { Component } from 'react';
import "./Login.css";
import BackgroundSlider from 'react-background-slider';
import axios from 'axios';
import { getFromStorage, setInStorage } from '../../utils/localstorage';

import { Route, Redirect } from 'react-router';


//import image1 from "../../images/001.jpg";
import image2 from "../../images/002.jpeg";
import image3 from "../../images/003.jpg";
import image4 from "../../images/004.jpeg";
import image5 from "../../images/005.jpeg";

class Login extends Component {

    state = {

        isLoading: true,
        token: false,
        signUpError: "",
        signInError: "",

        signup : true,
        signin : false,

        signUpEmail : "",
        signUpUsername : "",
        SignUpPassword : "",

        signInEmail : "",
        signInPassword : "",



    }

    componentDidMount() {

        const obj = getFromStorage('the_main_app');

        if (obj && obj.token) {

            const {token } = obj;

            axios.get("/api/auth/account/verify?token=" + token)
                
                .then(res => {

                    console.log(res);
                    if (res.data.status == "good") {
                        
                        return this.props.history.push('/dashboard')
                    //   return  <Redirect from='/' to='/dashboard'/>
                        // this.setState({
                        //     token,
                        //     isLoading: false
                        // });
                     
                    } else {
                        this.setState({
                            isLoading: true

                        });
                    }


                });
        } else {
            this.setState({
                isLoading: false
            })

        }
    }


    handleAuthentification = (e) => {
        this.setState({
            [e.target.name] : e.target.value

        })
    }


    handleShowSignIn = () => {

        this.setState({
            signup : !this.state.signup,
            signin : !this.state.signin
        })
    }

    onSignUp = () => {

        const signupInfo = {
           email: this.state.signUpEmail,
            username :this.state.signUpUsername, 
            password : this.state.signUpPassword

        }
     

        axios.post('/api/auth/account/signup', signupInfo )
        .then((res) => {

            console.log(res);


            this.setState({
                signup : !this.state.signup,
                signin : !this.state.signin
            })
        
            // if (res) {
            //     setInStorage('the_main_app', {token : res.data.token});

            //     return this.props.history.push("/dashboard")
            // }

        

        }).catch(err => console.log(err))

    }


    
    onSignIn = () => {

        const signinInfo = {
        email: this.state.signInEmail,
        password : this.state.signInPassword

        }
    

        axios.post('/api/auth/account/signin', signinInfo )
        .then((res) => {

            
            console.log(res);

            if (res.data.success) {
                setInStorage('the_main_app', {token : res.data.token});

                return this.props.history.push("/dashboard")
            }

        })

    }

    logout() {
        this.setState({
            isLoading : true,
        })

        const obj = getFromStorage('the_main_app');

        if (obj && obj.token) {

            const { token } = obj;

            axios.get("api/account/verify?token=" + token)
                .then(res => {
                    res.json()
                })
                .then(json => {
                    if (json.success) {

                        this.setState({
                            token : "",
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: true

                        });
                    }
                });
        } else {
            this.setState({
                isLoading: false
            })

        }
    }
   




    render() {

        const { isLoading } = this.state;

        if (isLoading) {

            return (<div><p>Loading ...</p></div>);
        }

        let signup;
        if (!this.state.token && this.state.signup) {
                signup = (
                    <div style={{display:"flex" , padding:"10px", width: "300px", justifyContent:"flex-start",border:"2px solid grey",  background:"lightseagreen", opacity:"0.9",flexDirection : "column"}}>
                        <h4 style={{alignSelf: "center" , fontWeight: "800"}}>Register</h4>
                        <label>Email :</label> <br />
                        <input 
                        style={{width: "100%"}}
                        type="email" 
                        placeholder="Email"
                        name="signUpEmail"
                        value={this.state.signUpEmail}
                        onChange = {this.handleAuthentification}
                        
                        />
                        <br/>
                        <label>Username :</label> <br />
                        <input 
                        type="text" 
                        style={{width: "100%"}}
                        placeholder="username" 
                        name="signUpUsername" 
                        value= {this.state.signUpUsername}
                        onChange = {this.handleAuthentification}
                        />
                        <br/>

                        <label>Password :</label> <br />
                        <input 
                        style={{width: "100%"}}
                        type="password" 
                        placeholder="password" 
                        name="signUpPassword" 
                        value = {this.state.signUpPassword}
                        onChange = {this.handleAuthentification}
                        
                        
                        />
                        <button  style={{marginTop:"10px", background:"transparent" ,border:"1px solid black"}} onClick={this.onSignUp}>Sign Up</button>

                    </div>

                )
              }

        let signin;
        if (!this.state.token && this.state.signin) {
                signin = (
                    <div style={{display:"flex" , padding:"10px", width: "300px", justifyContent:"flex-start",border:"2px solid grey", background:"lightseagreen", opacity:"0.9",flexDirection : "column"}}>
          
                        <h4 style={{alignSelf: "center" , fontWeight: "800"}}>Sign in</h4>
                                       
                        <label>Email :</label> <br />
                        <input 
                        style={{width: "100%"}}

                        type="email" 
                        placeholder="Email" 
                        name="signInEmail" 
                        value={this.state.signInEmail} 
                        onChange= {(this.handleAuthentification)}
                        
                        />
                        <br />
                        <label>Password :</label> 
                        <br />
                        
                        <input 
                        style={{width: "100%"}}

                        type="password" 
                        placeholder="password" 
                        name="signInPassword" 
                        value={this.state.signInPassword} 
                        onChange= {this.handleAuthentification}
                        />
                   
                   
                   
                    <button  style={{marginTop:"10px", background:"transparent" ,border:"1px solid black"}}onClick={this.onSignIn}>Sign In</button>

                     

                    </div>

                )
        }



        return (



            <div style={{display:"flex" }}>
                <BackgroundSlider
                    images={[image2, image3, image4, image5]}
                    duration={4}
                    transition={2}
                    

                />
                
                <div className="main-container">
               
                <div style={{display:"flex", width:"100%", margin:"10px", alignItems:"flex-end", justifyContent:"flex-end"}}>
                <button onClick={this.handleShowSignIn}>{this.state.signup ? <p>Sign In?</p> : <p>Sign Up?</p>}</button>
                </div>
                        
                    <h1 className="title">Welcome to the Git Project Hub!</h1>
                    <p className="subtitle"><b>theGigMaker</b> A web-based application that allows
                users to find git projects based on your interests and specialities.
                        </p>
               
                  
                <div >
                        {signup}
                        {signin}

               
                    </div>
                  
  
               
                </div>

                
            </div>
        )
    }
}

export default Login;