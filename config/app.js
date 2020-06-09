module.exports = {
    jwt: {
        secret: 'ti ne proidesh',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '15m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '60d'
            },
        },
    },
    saltRounds: 10,
    itemsOnPage: 10,
}