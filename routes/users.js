const router = require('express').Router();
const {
  getAllUsers, getUserById, editUserInfo, editUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.patch('/me', editUserInfo);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
