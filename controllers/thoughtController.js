const { Thought, User, Reaction } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((t) =>
        !t
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(t)
      )
      .catch((err) => res.status(500).json(err));
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then(async (t) => {
        let userWithThought = await User.findOne({ _id: req.body.userId });
        let thoughtArray = userWithThought.thoughts;
        thoughtArray.push(t);
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { thoughts: thoughtArray }
        );
        res
          .status(200)
          .json(`Updated user ${req.body.username} with new thought`);
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then(() => res.json({ message: "Thought deleted!" }))
      .catch((err) => res.status(500).json(err));
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body)
      .then(() => res.json({ message: "Thought updated!" }))
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((t) =>
        !t
          ? res.status(404).json({ message: "No thought found with that ID" })
          : res.json(t)
      )
      .catch((err) => res.status(500).json(err));
  },

  deleteReaction(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then(async (t) => {
        let reactionArray = t.reactions;

        for (var i = 0; i < reactionArray.length; i++) {
          if (reactionArray[i]._id == req.body.reactionId) {
            reactionArray.splice(i, 1);
          }
        }
        let updatedThought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { reactions: reactionArray }
        );
        res.status(200).json(`Reaction removed`);
      })
      .catch((err) => res.status(500).json(err));
  },
};