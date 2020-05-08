const { Router } = require('express');
const AccountTable = require('../account/table.js');
const AccountDragonTable = require('../accountDragon/table');
const Session = require('../account/session.js');
const { hash } = require('../account/helper.js');
const { setSession, authenticatedAccount } = require('./helper');
const { getDragonWithTraits } = require('../dragon/helper');

const router = new Router();

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    const usernameHash = hash(username);
    const passwordHash = hash(password);

    // check that account doesn't exist
    AccountTable.getAccount({ usernameHash })
        .then(({ account }) => {
            if (!account) {
                return AccountTable.storeAccount({ usernameHash, passwordHash });
            } else {
                const error = new Error('This username is already taken');
                
                error.statusCode = 409;

                throw error;
            }
        })
        .then(() => { // chained promise from storeAccount
            return setSession({ username, res });  // act also as if user logged in by setting a session
        })
        .then(({ message }) => {
            res.json({ message });
        })  
        .catch(error => next(error));
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    AccountTable.getAccount({ usernameHash: hash(username) })
        .then(({ account }) => {
            if (account && account.passwordHash === hash(password)) {
                const { sessionId } = account;  // will be defined if the user is still signed into the website (account still holds the sessionId).

                return setSession({ username, res, sessionId });
            } else {
                const error = new Error('Incorrect username/password');

                error.statusCode = 409;

                throw error;
            }
        })
        .then(({ message }) => res.json({ message }))
        .catch(error => next(error));
});

router.get('/logout', (req, res, next) => {
    const { username } = Session.parse(req.cookies.sessionString);

    AccountTable.updateSessionId({
        sessionId: null,
        usernameHash: hash(username)
    }).then(() => {
        // user has logged out and DB has been modified, now update the cookie.
        res.clearCookie('sessionString');

        res.json({ message: 'Succesful logout' });
    }).catch(error => next(error));
});

// checks if the sessionString in the cookies of the webpage is still valid
router.get('/authenticated', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ authenticated }) => res.json({ authenticated }))
        .catch(error => next(error))
});

router.get('/dragons', (req, res, next) => {
   authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
        return AccountDragonTable.getAccountDragons({
            accountId: account.id
        });
    })
    .then(({ accountDragons }) => {
        return Promise.all(
            accountDragons.map(accountDragon => {
                return getDragonWithTraits({ dragonId: accountDragon.dragonId })
            })
        );
        
    })
    .then(dragons => {
        res.json({ dragons });
    })
    .catch(error => next(error));
});

router.get('/info', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ account, username }) => {
            res.json({ info: { balance: account.balance, username } });
        })
        .catch(error => next(error));
});

module.exports = router;