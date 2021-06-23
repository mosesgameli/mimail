const User = require("../models/user.model");
const Mail = require("../models/mail.model");

const mailCtrl = {};

mailCtrl.sendMail = async function (req, res) {
  const newMail = Mail(req.body);
  try {
    let mail = await newMail.save();
    if (mail) {
      await User.updateOne({ username: req.body.sender }, { $push: { sent: [mail._id] } })
      await User.updateOne({ username: req.body.recipient }, { $push: { inbox: [mail._id] } })

      res.status(200).json({ success: true, message: 'sent mail successfully' });
    }
    throw new Error("could not send mail");
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

mailCtrl.deliverMail = function (req, res) {
  const { sender, type } = req.body
  try {
    User.findOne({ username: sender }).populate(type).exec(function (err, mls) {
      let data

      switch (type) {
        case 'inbox':
          data = mls.inbbox
          break
        case 'sent':
          data = mls.sent
          break
        default:
          data = 'invalid mailbox type'
      }

      if (err) {
        res.status(200).json({ success: false, message: err });
      } else {
        res.status(200).json({ success: true, type, data });
      }
    })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
};

mailCtrl.syncMail = async function (req, res) {
  const { state, id } = req.body
  try {
    await Mail.findOneAndUpdate({ _id: id }, { $set: { read: state } })
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

module.exports = mailCtrl;
