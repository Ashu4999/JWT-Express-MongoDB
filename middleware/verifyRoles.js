const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles)
            return res.sendStatus(401);

        const passedAllowedRoles = [...allowedRoles];
        const usersRoles = Object.values(req?.roles);
        console.log("Allowed Roles", passedAllowedRoles);
        console.log("User's Roles", usersRoles);

        const haveAccess =
            usersRoles.map(item => passedAllowedRoles.includes(item))
                .find(item => item === true);

        if (!haveAccess) // if user's role not match with allowed role then send 401(Unauthorized)
            return res.sendStatus(401);

        next();
    };
};

module.exports = verifyRoles;