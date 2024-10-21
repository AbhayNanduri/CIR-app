const User = require("../models/user");

module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: req.user,
  });
};

// updates user details
module.exports.update = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { username, password, confirm_password } = req.body;

    if (password != confirm_password) {
      req.flash("error", "New password and Confirm password are not same!");
      return res.redirect("back");
    }

    if (!user) {
      req.flash("error", "User does not exist!");
      return res.redirect("back");
    }

    user.username = username;
    user.password = password;

    user.save();
    req.flash("success", "profile updated!");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    console.log(err);
    return res.redirect("back");
  }
};

// render the Sign In page
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("user_sign_in", {
    title: "Placement cell | Sign In",
  });
};

// render the Sign Up page
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("user_sign_up", {
    title: "Placement cell | Sign Up",
  });
};

// // get Sign Up data
// module.exports.create = async (req, res) => {
//   try {
//     const { username, email, password, confirm_password } = req.body;

//     // if password doesn't match
//     if (password != confirm_password) {
//       req.flash("error", "Password and Confirm password are not same");
//       return res.redirect("back");
//     }

//     // check if user already exist
//     User.findOne({ email }, async (err, user) => {
//       if (err) {
//         console.log("Error in finding user in signing up");
//         return;
//       }

//       if (!user) {
//         await User.create(
//           {
//             email,
//             password,
//             username,
//           },
//           (err, user) => {
//             if (err) {
//               req.flash("error", "Couldn't sign Up");
//             }
//             req.flash("success", "Account created!");
//             return res.redirect("/");
//           }
//         );
//       } else {
//         req.flash("error", "Email already registed!");
//         return res.redirect("back");
//       }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid');

// Set up nodemailer for SendGrid
const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: 'YOUR_SENDGRID_API_KEY' // Replace with your actual SendGrid API key
  }
}));

module.exports.create = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    // if password doesn't match
    if (password != confirm_password) {
      req.flash("error", "Password and Confirm password are not the same.");
      return res.redirect("back");
    }

    // check if user already exists
    User.findOne({ email }, async (err, user) => {
      if (err) {
        console.log("Error in finding user during sign-up.");
        return;
      }

      if (!user) {
        // Generate a random OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store user data and OTP temporarily in session or database
        req.session.tempUser = { username, email, password, otp };

        // Send OTP to user's email using SendGrid
        const mailOptions = {
          from: 'otp-handler@yourdomain.com',  // Use your verified domain email
          to: email,  // this takes the user's typed email as the 'to' address
          subject: 'Your OTP for Sign-Up',
          text: `Your OTP for signing up is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending OTP: ', error);
            req.flash('error', 'Error sending OTP, please try again.');
            return res.redirect('back');
          } else {
            console.log('OTP sent: ' + info.response);
            req.flash('success', 'OTP sent to your email. Please verify.');
            return res.redirect('/verify-otp');
          }
        });
      } else {
        req.flash("error", "Email already registered!");
        return res.redirect("back");
      }
    });
  } catch (err) {
    console.log(err);
  }
};


// sign in and create a session for the user
module.exports.createSession = (req, res) => {
  req.flash("success", "Logged in successfully");
  return res.redirect("/dashboard");
};

// clears the cookie
module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    return res.redirect("/");
  });
};
