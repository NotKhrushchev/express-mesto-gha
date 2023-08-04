const router = require('express').Router();
const {
  createUser, getAllUsers, getUserById, editUserInfo, editUserAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.patch('/me', editUserInfo);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
