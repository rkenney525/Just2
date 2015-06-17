/**
 * Gets all of the input from the UI, converts to Number, and then returns them
 * all packaged in an Array.
 * 
 * @returns {Array} An Array consisting of all the numbers in the UI.
 */
function getNums() {
    var nums = [];
    $(".number").each(function () {
        nums.push(Number($(this).val()));
    });
    return nums;
}
/**
 * Apply the mask to the Array, and sum the value thats result from it.
 * 
 * @param {Array} array The Array to mask and sum
 * @param {Number} mask The mask to apply
 * @returns {Number} The sum of the array's values after applying the mask
 */
function arrayMaskSum(array, mask) {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        var digit = Math.pow(2, i);
        if ((mask & digit) === digit) {
            sum += array[i];
        }
    }
    return sum;
}
/**
 * Uses the specified mask to return a subset of the array. The positive
 * interpretation of the mask is the most intuitive. However there is a case
 * where we want the negation. Rather than negate/change the mask, we change how
 * the subset is built.
 * 
 * @param {Boolean} positive Whether the subset should be positive or negative
 * @param {Array} array The base array to use
 * @param {Number} mask The mask to apply
 * @returns {Array} The subset of array for the specified mask, applied either
 *  positively or negatively
 */
function arrayMaskSubset(positive, array, mask) {
    var subset = [];
    for (var i = 0; i < array.length; i++) {
        var digit = Math.pow(2, i);
        var check = (positive) ? digit : 0;
        if ((mask & digit) === check) {
            subset.push(array[i]);
        }
    }
    return subset;
}
/**
 * Get the identity mask for this array. Essentially, this number, in binary,
 * would be as many 1s as there are elements in the array.
 * 
 * So the mask for [1,2,3] in binary is 111.
 * 
 * @param {Array} array An to find the mask for
 * @returns {Number} The identity mask for array
 */
function getArrayMask(array) {
    return Math.pow(2, array.length) - 1;
}
/**
 * In the event that the execution is slowed down for whatever reason (either
 * shitty code or shitty hardware or both), the updating a small piece of text
 * let's the user know whether or not the prgram thinks it's done.
 * 
 * @param {String} status The status to display
 * @returns {undefined}
 */
function updateStatus(status) {
    $('#status').text(status);
}
/**
 * Take in the two solution arrays and display them. In the game, Red requires
 * you to click twice, so make the shorter of the two be red.
 * 
 * @param {Array} a1 The first Array
 * @param {Array} a2 The second Array
 * @returns {undefined}
 */
function updateResults(a1, a2) {
    // Init
    var reds, greens;
    
    // Determine the shorter array and make it red
    if (a1.length > a2.length) {
        reds = a2;
        greens = a1;
    } else {
        reds = a1;
        greens = a2;
    }
    
    // Display the results
    $('#reds').text(reds);
    $('#greens').text(greens);
}

$(document).ready(function () {
    $('#execute').bind('click', function () {
        // Init
        var nums = getNums();
        var solutionReds;
        var solutionGreens;
        updateStatus("Busy");

        // Start with red
        // Get the mask (always going to be 2^9 - 1
        var redMask = getArrayMask(nums);
        // Start with 1 since no solution will ever have 0 reds or greens
        for (var i = 1; i < redMask; i++) {
            var redSum = arrayMaskSum(nums, i);

            // Now do greens
            var greenArray = arrayMaskSubset(false, nums, i);
            var greenMask = getArrayMask(greenArray);
            for (var j = 1; j < greenMask; j++) {
                var greenSum = arrayMaskSum(greenArray, j);
                if (greenSum === redSum) {
                    // We have a winner
                    solutionReds = arrayMaskSubset(true, nums, i);
                    solutionGreens = arrayMaskSubset(true, greenArray, j);
                    updateResults(solutionReds, solutionGreens);
                    updateStatus("Ready");
                    return;
                }
            }
        }

        // Clean up if nothing worked somehow
        updateStatus("Ready");
    });
    /**
     * Logic for the clear button. Empties the input fields and the two result
     * areas.
     */
    $('#clear').bind('click', function () {
        $(".number").each(function () {
            $(this).val("");
        });
        $('#reds').empty();
        $('#greens').empty();
    });
});