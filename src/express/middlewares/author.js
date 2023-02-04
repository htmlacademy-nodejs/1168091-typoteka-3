import {UserRole} from "../../const.js";

export default (req, res, next) => {
  const {user} = req.session;

  if (!user || user.role !== UserRole.AUTHOR) {
    return res.render(`errors/404`);
  }
  return next();
};
