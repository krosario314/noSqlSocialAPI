const { User, Thought } = require("../models");

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then(async (u) => {
        const thoughtsArray = u.thoughts;
        thoughtsArray.forEach(
          async (t) => await Thought.findOneAndDelete({ _id: t })
        );
      })
      .then(async () => await User.findOneAndDelete({ _id: req.params.userId }))
      .then(() => res.json({ message: "User deleted!" }))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body)
      .then(() => res.json({ message: "User updated!" }))
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    User.findOne({ _id: req.params.userId })
      .then(async (user) => {
        const friendArray = user.friends;
        const newFriend = await User.findOne({ _id: req.params.friendId });
        friendArray.push(newFriend);
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { friends: friendArray }
        );
        res.status(200).json(`Friend added to ${updatedUser.username}`);
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteFriend(req, res) {
    User.findOne({ _id: req.params.userId })
      .then(async (user) => {
        const friendArray = user.friends;

        for (var i = 0; i < friendArray.length; i++) {
          if (friendArray[i]._id == req.params.friendId) {
            friendArray.splice(i, 1);
          }
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { friends: friendArray }
        );
        res.status(200).json(`Friend removed from ${updatedUser.username}`);
      })
      .catch((err) => res.status(500).json(err));
  },
};