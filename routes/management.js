

app.put("/profile/edit", (req, res) => {
  if (req.session.userId) {
    //todo: new password and old password
    if (req.body.username || req.body.password) {
      dbConnection.then(db => {
        Register.findById(req.session.userId)
          .then(user => {
            const verifyPassword = bcrypt.compareSync(
              req.body.password,
              user.password
            );
            if (verifyPassword && req.body.password) {
              req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
            }
            if(user.username !== req.body.username && verifyPassword === false){
              req.body.username ? (user.username = req.body.username) : null;
              req.body.password ? (user.password = req.body.password) : null;
              console.log(user);
              user.save()
                .then(() => {
                  res.json("Profile updated");
                })
                .catch(err => {
                  console.log("Error saving to db", err)
                })
            } else {
              console.log("You need to introduce new data not the old one.")
              res.sendStatus(406)
            }
          })
          .catch(err => {
            console.log("Couldn't find this id", err);
            res.sendStatus(404);
          });
      });
    } else {
      console.log("Nothing has been introduced.");
      res.sendStatus(404);
    }
  } else {
    console.log("User is not connected.");
    res.sendStatus(401);
  }
});