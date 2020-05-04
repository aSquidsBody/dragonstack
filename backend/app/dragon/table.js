const pool = require('../../databasePool.js');
const DragonTraitTable = require('../dragonTrait/table.js');

class DragonTable{
    static storeDragon(dragon) {
        // generationId is defined since the generation has been databased, but dragonId (dragon.id in the db) is not defined yet
        const { birthdate, nickname, generationId } = dragon;  

        // promise allows data in response to be passed back to the code where the storeDragon method is called
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO dragon(birthdate, nickname, "generationId") 
                 VALUES($1, $2, $3) RETURNING id`,
                [birthdate, nickname, generationId],
                (error, response) => {
                    if (error) return reject(error);
                    
                    const dragonId = response.rows[0].id;  // now we have the id from the table

                    // link the Id with the dragon's traits in the dragonTrait table
                    // Use the DragonTraitTable.storeDragonTrait on each traitType and traitValue in the traits array and then a promise which waits for all to complete.
                    Promise.all(dragon.traits.map(({ traitType, traitValue }) => {
                        return DragonTraitTable.storeDragonTrait({
                            dragonId, traitType, traitValue
                        });
                    }))
                    .then(() => resolve({ dragonId }))
                    .catch(error => reject(error));
                }
            )
        });
    }

    static getDragon({ dragonId }){
        return new Promise((resolve, reject) =>
        pool.query(
            `SELECT birthdate, nickname, "generationId" 
             FROM dragon 
             WHERE dragon.id = $1`,
            [dragonId],
            (error, response) => {
                if (error) return reject(error);

                if (response.rows.length === 0) return reject(new Error("no dragon"));

                resolve(response.rows[0]);
            }
        ))
    }
}

module.exports = DragonTable;