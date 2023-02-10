getRandomAvatar = (req, res, next) => {
  const randomPicture = Math.floor(Math.random() * 100);
  const randomGender = ["men", "women"][Math.floor(Math.random() * 2)];
  req.avatar = `https://randomuser.me/api/portraits/${randomGender}/${randomPicture}.jpg`;
  next();
};

module.exports = { getRandomAvatar };