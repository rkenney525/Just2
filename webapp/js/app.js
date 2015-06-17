$(document).ready(function () {
    function getNums() {
        var nums = [];
        $(".number").each(function () {
            nums.push(Number($(this).val()));
        });
        return nums;
    }
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
    function getArrayMask(array) {
        return Math.pow(2, array.length) - 1;
    }
    function updateStatus(status) {
        $('#status').text(status);
    }
    function updateResults(reds, greens) {
        $('#reds').text(reds);
        $('#greens').text(greens);
    }
    $('#execute').bind('click', function () {
        // Init
        var nums = getNums();
        var solutionReds;
        var solutionGreens;
        updateStatus("Busy");
        
        // Start with red
        // Get the mask (always going to be 2^9 - 1
        var redMask = getArrayMask(nums);
        // Start with 1 since no solution will ever 0 reds or greens
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
    $('#clear').bind('click', function () {
        $(".number").each(function () {
            $(this).val("");
        });
    });
});