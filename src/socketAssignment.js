// @ts-check
'use strict';
/**
 * socket assignment
 * @param {number} y The value to the left of target
 * @param {number} x The tagets value
 * @return {boolean} the string indicating direction
 */
module.exports = function socketAssignment(y, x) {
    return ((y === 0 && x <= 50) ||
        (y === 1 && x > 50 && x <= 100) ||
        (y === 2 && x > 100 && x <= 150) ||
        (y === 3 && x > 150 && x <= 200) ||
        (y === 4 && x > 200 && x <= 250) ||
        (y === 5 && x > 250 && x <= 300) ||
        (y === 6 && x > 300 && x <= 350) ||
        (y === 7 && x > 350 && x <= 450)
    );
};
