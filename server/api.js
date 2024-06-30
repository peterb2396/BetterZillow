  var express = require('express');
  var router = express.Router();
  require('dotenv').config();
  var axios = require('axios')
  const xlsx = require('xlsx');
  const path = require('path');
  const dbConnect = require("./db/dbConnect");
  const User = require("./db/userModel");
  const Options = require("./db/optionsModel");
  const nodemailer = require('nodemailer');
  const bcrypt = require("bcrypt");

   // DB connection
   dbConnect()

    // Mailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  const readAndFilterExcel = (mintemp, maxtemp, mindensity, maxdensity) => {
    const workbook = xlsx.readFile(path.join(__dirname, 'weather.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
  
    // Filter the data based on the given temperature range
    return data.filter(row => row['Minimum Temperature'] > mintemp && row['Maximum Temperature'] < maxtemp && row['Density'] > (mindensity /2.59) && row['Density'] < (maxdensity /2.59));
  };
  
  // Define the endpoint
  router.post('/filter', (req, res) => {
    try {
      const filteredData = readAndFilterExcel(req.body.minTemp, req.body.maxTemp, req.body.minDensity, req.body.maxDensity);

      res.json(filteredData);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      res.status(500).send('An error occurred while reading the Excel file.');
    }
  });

  
  router.post('/explore', async(req, response) => {
    let town = req.body.town
    //let radius = req.body.radius
    let types = ["bar", "school", "cafe"]
    


    axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="${town.Latitude},${town.Longitude}+"&radius="${10}"&types="${types}"&key=${process.env.MAPS_KEY}`)
    .then((res) => {
      // TODO : Format this response, gather input for radius? Types??
      console.log(res)
      response.send(res)
    })
    .catch((e) =>
    {
      console.log(e)
    })
  })

  router.get('/confirm/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find the user by userId
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Mark the user as verified : allows them to access the site
      // TODO: Delete users if not confirmed in 24hrs
      user.email_confirmed = true;
      await user.save();

      // Email me of the new user, if option is enabled
      Options.findOne({}).then((option_doc) => {
        if (option_doc.registerAlerts)
        {
          // Send the email
          const mailOptions = {
            from: process.env.MAILER_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `Zillow new user! 😁`,
            text: `${request.body.email} has signed up!`,
          };
        
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error sending new user email (to myself):', error);
            } else {
            }
          });
          
        }

      })
  
      res.send('Account verified successfully');
    } catch (err) {
      console.error('Error confirming account:', err);
      res.status(500).send('Server error');
    }
  });

  
// Allow a user to request another confirmation email by hitting this endpoint with their email
router.post("/requestConfirmationEmail", async(req, res) => {
  User.findOne({ email: req.body.email })
  .then((user) => {sendConfirmEmail(user)})
})

// login endpoint
router.post("/login", async(request, response) => {
    // check if email exists
    
    User.findOne({ email: request.body.email })
    
      // if email exists
      .then((user) => {
        
        
        // compare the password entered and the hashed password found
        bcrypt
          .compare(request.body.password, user.password)

          // if the passwords match
          .then(async (passwordCheck) => {

            // check if password matches
            if(!passwordCheck) {
                return response.status(400).send({
                message: "Passwords does not match",
              });
            }

            // Is this account awaiting confirmation?
            if (!user.email_confirmed)
            {
              sendConfirmEmail(user);
            
              // new account made, to be confirmed by user
              response.status(409).send({
                message: "Awaiting Confirmation"
              });
            }

            // Log the user in, return their data
            response.json({uid: user._id,  confirmed: user.email_confirmed})

  
            
          })
          // catch error if password does not match
          .catch((error) => {
            console.log(error)
            response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        // need to register the user.
        bcrypt
      .hash(request.body.password, 5)
      .then((hashedPassword) => {
        // create a new user instance and collect the data
        const user = new User({
          email: request.body.email,
          password: hashedPassword,
        });
  
        // save the new user
        user.save()
          // return success if the new user is added to the database successfully
          .then((result) => {

            sendConfirmEmail(user);

            // new account made, to be confirmed by user
            response.status(201).send({
              message: "User Created Successfully",
              result,
            });
          })
          // catch error if the new user wasn't added successfully to the database
          .catch((errorResponse) => {
            let errorMessage = null;

            for (const key in errorResponse['errors']) {
              if (errorResponse['errors'][key].properties && errorResponse['errors'][key].properties.message) {
                errorMessage = errorResponse['errors'][key].properties.message;
                break; // Stop iterating once found
              }
            }

            if (errorMessage)
            {
              console.log(errorMessage)
              response.status(403).send({
                message: errorMessage
              });
            }
            else{
              response.status(500).send({
                message: "User already exists!"
              });
            }
            
            
          });
      })
      // catch error if the password hash isn't successful
      .catch((e) => {
        console.log(e)
        response.status(500).send({
          message: "Password was not hashed successfully"
        });
      });
        
      });
  });

  function sendConfirmEmail(user)
  {
    // Send confirmation email
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: user.email,
      subject: `Please confirm your account`,
      html: `
        <p>Hello,</p>
        <p>Please click the following link to verify your account:</p>
        <a href="${process.env.URL}:${process.env.PORT}/confirm/${user._id}">Verify Account</a>
      `
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending account verification email:', error);
      } else {
      }
    });
  }


  module.exports = router;