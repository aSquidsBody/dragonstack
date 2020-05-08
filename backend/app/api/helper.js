const Session = require('../account/session.js');
const AccountTable = require('../account/table');
const { hash } = require('../account/helper');

const setSession = ({ username, res, sessionId }) => {
    return new Promise((resolve, reject) => {
        let session, sessionString;

        if (sessionId) {
            sessionString = Session.sessionString({ username, id: sessionId });

            setSessionCookie({ sessionString, res })

            resolve({ message: 'session restored' });
        } else {
            const session = new Session({ username });
            const sessionString = session.toString();

            AccountTable.updateSessionId({ 
                sessionId: session.id, 
                usernameHash: hash(username) 
            })
            .then(() => {
                // set a browser cookie
                setSessionCookie({ sessionString, res })
    
                resolve({ message: 'session created' });
            })
            .catch(error => reject(error));
        }       
    });
}

const setSessionCookie = ({ sessionString, res }) => {
    res.cookie('sessionString', sessionString, {
        expire: Date.now() + 3600000,
        httpOnly: true,  // eliminates clientside JS from sniffing out cookie
        // secure: true  // ensure cookie can only be sent over https
    });
};

const authenticatedAccount = ({ sessionString }) => {
    return new Promise((resolve, reject) => {
        if (!sessionString || !Session.verify(sessionString)) {
            const error = new Error('Invalid session');
    
            error.statusCode = 400;
    
            return reject(error);
        } else {
            const { username, id } = Session.parse(sessionString);
    
            // check that the sessionString corresponds to the username and id in the DB
            AccountTable.getAccount({ usernameHash: hash(username) })
                .then(({ account }) => {
                    const authenticated = account.sessionId === id;
    
                    resolve({ account, authenticated, username });
                })
                .catch(error => reject(error));
        }
    });
};

module.exports = { setSession, authenticatedAccount };