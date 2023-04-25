const { Users, UserSession } = model("");
const { Op } = require('sequelize');
const { signupSchema, loginSchema, changePasswordSchema } = validate("UserValidator");
const { HashPassword, passwordCheck, assignToken, compare, options } = helper("UserHelpers");

module.exports = class UserController {




  // USERS SIGNUP //

  async signup(req, res) {

    try {
      const { error, value } = signupSchema.validate(req.body);

      if (error) {
        return res.status(400).json(error.message)

      } else {
        const { password } = value;
        await passwordCheck(password);

        const hash = await HashPassword(password);
        const user = await Users.create({ ...value, password: hash });
        const token = await assignToken(user.id);
        return res.status(200).cookie('Token', token, options).json({ 'status': 'success', 'message': 'user registered successfully' });
      }
    } catch (err) {
      return res.status(500).json({ 'status': 'failed', 'message': err.message })
    }

  };




  // USER LOGIN //

  async login(req, res) {

    try {
      if (req.cookies.Token) {
        const session = await UserSession.findOne({ where: { token: req.cookies.Token } });
        if (session) {
          return res.status(200).cookie('Token', session.token, options).json({ 'status': 'success', 'message': 'user login successfully' });
        }
      }
      const { error, value } = loginSchema.validate(req.body);
      if (error) {

        return res.status(400).json(error.message)
      } else {
        const exist = await Users.findOne({ where: { email: value.email } });
        if (exist) {
          await compare(req, res, value.password, exist.password);
          const token = await assignToken(exist.id);
          await UserSession.create({
            user_id: exist.id,
            token: token
          });
          return res.status(200).cookie('Token', token, options).json({ 'status': 'success', 'message': 'user login successfully' });

        } else {
          return res.status(400).json({ 'status': 'failed', 'message': 'invalid email' })
        }
      }
    } catch (err) {
      return res.status(500).json({ 'status': 'failed', 'message': err.message })
    }

  };




  // USER LOGOUT //

  async logout(req, res) {
    try {
      const exist = await UserSession.findOne({ where: { token: req.cookies.Token } });
      if (exist) {
        await exist.destroy();
        return res.status(200).json({ 'status': 'success', 'message': 'user logout successfully' })
      } else {
        return res.status(400).json({ 'status': 'failed', 'message': 'please login first' })
      }
    } catch (err) {
      return res.status(500).json({ 'status': 'failed', 'message': err.message })
    }
  }




  // DEACTIVATE ACCOUNT //

  async deactivate(req, res) {
    try {
      await UserSession.destroy({ where: { token: req.cookies.Token } });
      await Users.destroy({ where: { id: req.user.id } });
      return res.status(200).json({ 'status': 'success', 'message': 'user account deactivate successfully' });
    } catch (err) {
      return res.status(500).json({ 'status': 'failed', 'message': err.message })
    }
  };




  // USER LOGIN COUNT //

  async loginCount(req, res) {
    try {
      const count = await UserSession.count({ where: { user_id: req.user.id } });
      return res.status(200).json({ 'status': 'success', 'data': count })
    } catch (err) {
      return res.status(500).json({ 'status': 'failed', 'message': err.message })
    }
  };




  // LOGOUT FROM ANOTHER DEVICES //

  async logoutOtherDevices(req, res) {
    try {
      await UserSession.destroy({ where: { user_id: req.user.id, token: { [Op.ne]: req.cookies.Token } } });
      return res.status(200).json({ 'status': 'success', 'messages': 'logout from all other devices' })
    } catch (err) {
      return res.status(500).json({ 'status': 'failed', 'message': err.message })
    }
  };





  // CHANGE USER PASSWORD //

  async changePassword(req, res) {

    try {
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) {

        return res.status(400).json(error.message)

      } else {
        await compare(req, res, value.current_password, req.user.password);
        await passwordCheck(value.new_password);

        const hash = await HashPassword(value.new_password);
        req.user.update({
          password: hash
        });

        return res.status(200).json({ 'status': 'success', 'message': 'password changed successfully' })
      }
    } catch (err) {
      return res.status(500).json({ 'status': 'failed', 'message': err.message })
    }
  };



};
