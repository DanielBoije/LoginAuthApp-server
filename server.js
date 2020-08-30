const express = require('express');
const jwt = require("jsonwebtoken");
const orders = require("./schema")

const app = express();

app.use(express.json());
app.use(express.urlencoded());    //Theese app.use functions are needed to be able to get the req.body.

let users = [{ id: 1, email: 'john@email.com', password: 'pw123' }]; //hardcoded
const secret = 'sseeccrreett'     //hardcoded

app.post('/api/auth', function(req, res) {
  const { email, password } = req.body;
  const user = users.find(record => record.email === email && record.password === password);
  
  if (!user) {
    return res.send({
      token: null,
      message: "Invalid Password!"
    });
  }

  var token = jwt.sign({ id: user.id }, secret, {
    expiresIn: 3600 // 1 hours
  });

  res.status(200).send({
    token: token
  });

});

app.get("/api/orders", verifyToken, (req, res) => {   // Protected. Can't be reached without a token.
    jwt.verify(req.token, secret, (err) => {
        if(err) {
          console.log(req)
            res.json({
              message:"No permission"
            });
        } else {
            res.json({
                message: "post created",
                orders
            })
        }
    })

})

app.get("/api/orders/:id", verifyToken, (req, res) => {   // Protected. Can't be reached without a token.
    jwt.verify(req.token, secret, (err) => {
        if(err) {
            res.json({
              message:"No permission"
            });
        } else {
            if(req.params.id){
              const data = orders.find(order=>order.id==req.params.id)
              if(data)
                res.json({
                  message: "post created",
                  orders: data
                })
              else
                res.json({
                  message: "not found",
                })
            }
            else
              res.json({
                message: "id incorrect",
              })
        }
    })

})

//middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (typeof authHeader !== "undefined") {
      req.token = authHeader;
      next();
  } else {
      res.json({
          message: "Forbidden"
      })
  }
} 

app.listen(4000, () => console.log("running on port 4000"))