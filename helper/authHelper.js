exports.isUsername = username => {
    const isUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return isUsername.test(username);
}
