var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;


var UserSchema = new Schema({
 
  username: {
    type: String,
    trim: true,
    required: "Username is Required"
  },

  // googleId: {
  //   type: String,
  //   trim: true,
  //   required: "Password is Required",
  // },

  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  
  password : {
    type : String,
    required: "Password is Required",
    length: {
      min: 6,
    },

  },
 
  userCreated: {
    type: Date,
    default: Date.now
  },

  // if collaboration is true populate the user info to the creator
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project"
    }
  ],

  gigster: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collaborator"
    }
  ],

  collaborations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collaboration"
    },
    {
      approved: false
    }
  ]
});


UserSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password);

}

var User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;