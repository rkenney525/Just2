/* global QUnit */

/**
 * Any functions that will be useful for testing. Putting them in an object
 * ensures there are no namespace-related issues.
 * 
 * @type Object
 */
var TestUtil = {
    appendResultsBlocks: function () {
        var $reds = $('<span id="reds"></span>');
        var $greens = $('<span id="greens"></span>');
        var $fixture = $('#qunit-fixture');
        $fixture.append($reds);
        $fixture.append($greens);
    },
    appendStatusBlock: function () {
        var $input = $('<span id="status">Garbage text lolo</span>');
        $('#qunit-fixture').append($input);
    },
    clearFixture: function () {
        $('#qunit-fixture').empty();
    },
    createNumber: function (number) {
        var $input = $('<input type="text" class="number" style="display: none;" />');
        $input.val(number);
        $('#qunit-fixture').append($input);
    },
    generateRandomNumbers: function (count) {
        var ret = [];
        for (var i = 0; i < count; i++) {
            ret.push(Math.round(Math.random() * 99));
        }
        return ret;
    }
};

QUnit.testStart(function () {
    TestUtil.clearFixture();
});

QUnit.module("getNums()");
QUnit.test("No numbers", function (assert) {
    var nums = getNums();
    assert.notStrictEqual(nums, null, "The array should exist");
    assert.strictEqual(nums.length, 0, "The array should be empty");
});
QUnit.test("One number", function (assert) {
    // Init
    var nums = [];
    var number = 5;

    // Create the number and get the list
    TestUtil.createNumber(number);
    nums = getNums();

    // Assertions
    assert.notStrictEqual(nums, null, "The array should exist");
    assert.strictEqual(nums.length, 1, "The array should have exactly one element");
    assert.strictEqual(nums[0], number, "The first (and only) element should be " + number);
});
QUnit.test("Multiple numbers", function (assert) {
    // Init
    var nums = [];
    var size = 9;
    var numbers = TestUtil.generateRandomNumbers(size);

    // Create the HTML and get the list
    for (var i = 0; i < size; i++) {
        TestUtil.createNumber(numbers[i]);
    }
    nums = getNums();

    // Assertions
    assert.notStrictEqual(nums, null, "The array should exist");
    assert.strictEqual(nums.length, size, "The array should have exactly " + size + " elements");
    for (var i = 0; i < size; i++) {
        assert.strictEqual(nums[i], numbers[i], "[Random] Number " + (i + 1) + " should be " + numbers[i]);
    }
});

QUnit.module("arrayMaskSum(Array, Integer)");
QUnit.test("One entry array, both masks", function (assert) {
    var array = [1];
    assert.strictEqual(arrayMaskSum(array, 0), 0, "Masked with 0, the sum is 0");
    assert.strictEqual(arrayMaskSum(array, 1), 1, "Masked with 1, the sum is 1");
});
QUnit.test("Two entry array, all four masks", function (assert) {
    var array = [1, 1];
    assert.strictEqual(arrayMaskSum(array, 0), 0, "Masked with 0, the sum is 0");
    assert.strictEqual(arrayMaskSum(array, 1), 1, "Masked with 1, the sum is 1");
    assert.strictEqual(arrayMaskSum(array, 2), 1, "Masked with 2, the sum is 1");
    assert.strictEqual(arrayMaskSum(array, 3), 2, "Masked with 3, the sum is 2");
});
QUnit.test("Two entry array, numbers other than one, all four masks", function (assert) {
    var array = [3, 2];
    assert.strictEqual(arrayMaskSum(array, 0), 0, "Masked with 0, the sum is 0");
    assert.strictEqual(arrayMaskSum(array, 1), 3, "Masked with 1, the sum is 3");
    assert.strictEqual(arrayMaskSum(array, 2), 2, "Masked with 2, the sum is 2");
    assert.strictEqual(arrayMaskSum(array, 3), 5, "Masked with 3, the sum is 5");
});
QUnit.test("Many entry array, numbers other than one, select masks", function (assert) {
    var array = [3, 2, 1, 8, 4];
    assert.strictEqual(arrayMaskSum(array, 1), 3, "Masked with 1, the sum is 3");
    assert.strictEqual(arrayMaskSum(array, 7), 6, "Masked with 7, the sum is 6");
    assert.strictEqual(arrayMaskSum(array, 5), 4, "Masked with 5, the sum is 4");
    assert.strictEqual(arrayMaskSum(array, 15), 14, "Masked with 15, the sum is 14");
    assert.strictEqual(arrayMaskSum(array, 28), 13, "Masked with 28, the sum is 13");
});

QUnit.module("arrayMaskSubset(Boolean, Array, Integer)");
QUnit.test("Negative mask on single entry array", function (assert) {
    // Init
    var array = [1];
    var mask = getArrayMask(array);
    var subset;

    // Get the subset
    subset = arrayMaskSubset(false, array, mask);

    // Assertions
    assert.notStrictEqual(subset, null, "The array should exist");
    assert.strictEqual(subset.length, 0, "The array should be empty");
});
QUnit.test("Positive mask on single entry array", function (assert) {
    // Init
    var num = 4;
    var array = [num];
    var mask = getArrayMask(array);
    var subset;

    // Get the subset
    subset = arrayMaskSubset(true, array, mask);

    // Assertions
    assert.strictEqual(subset.length, 1, "It should still have one element");
    assert.strictEqual(subset[0], num, "The one element should be " + num);
});
QUnit.test("Positive masks on a complex array", function (assert) {
    // Init
    var array = TestUtil.generateRandomNumbers(9);
    var subset;

    // 29 mask gives us indices 1, 5, 6, 7, 8
    subset = arrayMaskSubset(false, array, 29);
    assert.strictEqual(subset.length, 5, "The array should have 5 elements");
    assert.strictEqual(subset[0], array[1], "[Random]Mask 29 Number 1 should be " + array[1]);
    assert.strictEqual(subset[1], array[5], "[Random]Mask 29 Number 2 should be " + array[5]);
    assert.strictEqual(subset[2], array[6], "[Random]Mask 29 Number 3 should be " + array[6]);
    assert.strictEqual(subset[3], array[7], "[Random]Mask 29 Number 4 should be " + array[7]);
    assert.strictEqual(subset[4], array[8], "[Random]Mask 29 Number 5 should be " + array[8]);

    // 124 mask gives us indices 0, 1, 8
    subset = arrayMaskSubset(false, array, 124);
    assert.strictEqual(subset.length, 4, "The array should have 4 elements");
    assert.strictEqual(subset[0], array[0], "[Random]Mask 124 Number 1 should be " + array[0]);
    assert.strictEqual(subset[1], array[1], "[Random]Mask 124 Number 2 should be " + array[1]);
    assert.strictEqual(subset[2], array[7], "[Random]Mask 124 Number 3 should be " + array[7]);
    assert.strictEqual(subset[3], array[8], "[Random]Mask 124 Number 4 should be " + array[8]);

    // 1 mask gives us indices 1, 2, 3, 4, 5, 6, 7, 8
    subset = arrayMaskSubset(false, array, 1);
    assert.strictEqual(subset.length, 8, "The array should have 8 elements");
    assert.strictEqual(subset[0], array[1], "[Random]Mask 1 Number 1 should be " + array[1]);
    assert.strictEqual(subset[1], array[2], "[Random]Mask 1 Number 2 should be " + array[2]);
    assert.strictEqual(subset[2], array[3], "[Random]Mask 1 Number 3 should be " + array[3]);
    assert.strictEqual(subset[3], array[4], "[Random]Mask 1 Number 4 should be " + array[4]);
    assert.strictEqual(subset[4], array[5], "[Random]Mask 1 Number 5 should be " + array[5]);
    assert.strictEqual(subset[5], array[6], "[Random]Mask 1 Number 6 should be " + array[6]);
    assert.strictEqual(subset[6], array[7], "[Random]Mask 1 Number 7 should be " + array[7]);
    assert.strictEqual(subset[7], array[8], "[Random]Mask 1 Number 8 should be " + array[8]);

    // 441 mask gives us indices 1, 2, 6
    subset = arrayMaskSubset(false, array, 441);
    assert.strictEqual(subset.length, 3, "The array should have 3 elements");
    assert.strictEqual(subset[0], array[1], "[Random]Mask 441 Number 1 should be " + array[1]);
    assert.strictEqual(subset[1], array[2], "[Random]Mask 441 Number 2 should be " + array[2]);
    assert.strictEqual(subset[2], array[6], "[Random]Mask 441 Number 3 should be " + array[6]);
});
QUnit.test("Positive masks on a complex array", function (assert) {
    // Init
    var array = TestUtil.generateRandomNumbers(14);
    var subset;

    // 34 mask gives us indices 1 and 5
    subset = arrayMaskSubset(true, array, 34);
    assert.strictEqual(subset.length, 2, "The array should have 2 elements");
    assert.strictEqual(subset[0], array[1], "[Random]Mask 34 Number 1 should be " + array[1]);
    assert.strictEqual(subset[1], array[5], "[Random]Mask 34 Number 2 should be " + array[5]);

    // 123 mask gives us indices 0, 1, 3, 4, 5, 6
    subset = arrayMaskSubset(true, array, 123);
    assert.strictEqual(subset.length, 6, "The array should have 6 elements");
    assert.strictEqual(subset[0], array[0], "[Random]Mask 123 Number 1 should be " + array[0]);
    assert.strictEqual(subset[1], array[1], "[Random]Mask 123 Number 2 should be " + array[1]);
    assert.strictEqual(subset[2], array[3], "[Random]Mask 123 Number 3 should be " + array[3]);
    assert.strictEqual(subset[3], array[4], "[Random]Mask 123 Number 4 should be " + array[4]);
    assert.strictEqual(subset[4], array[5], "[Random]Mask 123 Number 5 should be " + array[5]);
    assert.strictEqual(subset[5], array[6], "[Random]Mask 123 Number 6 should be " + array[6]);

    // 4 mask gives us index 2
    subset = arrayMaskSubset(true, array, 4);
    assert.strictEqual(subset.length, 1, "The array should have 1 element");
    assert.strictEqual(subset[0], array[2], "[Random]Mask 4 Number 1 should be " + array[2]);

    // 4351 mask gives us indices 0, 1, 2, 3, 4, 5, 6, 7, 13
    subset = arrayMaskSubset(true, array, 4351);
    assert.strictEqual(subset.length, 9, "The array should have 9 elements");
    assert.strictEqual(subset[0], array[0], "[Random]Mask 4351 Number 1 should be " + array[0]);
    assert.strictEqual(subset[1], array[1], "[Random]Mask 4351 Number 2 should be " + array[1]);
    assert.strictEqual(subset[2], array[2], "[Random]Mask 4351 Number 3 should be " + array[2]);
    assert.strictEqual(subset[3], array[3], "[Random]Mask 4351 Number 4 should be " + array[3]);
    assert.strictEqual(subset[4], array[4], "[Random]Mask 4351 Number 5 should be " + array[4]);
    assert.strictEqual(subset[5], array[5], "[Random]Mask 4351 Number 6 should be " + array[5]);
    assert.strictEqual(subset[6], array[6], "[Random]Mask 4351 Number 7 should be " + array[6]);
    assert.strictEqual(subset[7], array[7], "[Random]Mask 4351 Number 8 should be " + array[7]);
    assert.strictEqual(subset[8], array[12], "[Random]Mask 4351 Number 9 should be " + array[12]);
});

QUnit.module("getArrayMask(Array)");
QUnit.test("No element array", function (assert) {
    assert.strictEqual(getArrayMask([]), 0, "Zero elements equals a 0 mask");
});
QUnit.test("One element array", function (assert) {
    assert.strictEqual(getArrayMask([1]), 1, "One element equals a mask of 1");
});
QUnit.test("Two element array", function (assert) {
    assert.strictEqual(getArrayMask([1, 1]), 3, "Two elements equals a mask of 3");
});
QUnit.test("Five element array", function (assert) {
    assert.strictEqual(getArrayMask([1, 1, 1, 1, 1]), 31, "Five elements equals a mask of 31");
});
QUnit.test("Sixteen element array", function (assert) {
    assert.strictEqual(getArrayMask([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), 65535, "Sixteen elements equals a mask of 65535");
});

QUnit.module("updateStatus(String)");
QUnit.test("Pass in some String", function (assert) {
    // Init
    var input = "Hello, world!";
    var status;

    // Set up
    TestUtil.appendStatusBlock();
    updateStatus(input);

    // Check the value
    status = $('#status').text();
    assert.strictEqual(status, input, "The value should match the exact input provided.");
});
QUnit.test("Pass in Strings multiple times", function (assert) {
    // Init
    var first = "Hello, world!";
    var second = "Some more text";
    var last = "This will be the final value";
    var status;

    // Set up
    TestUtil.appendStatusBlock();
    updateStatus(first);
    updateStatus(second);
    updateStatus(last);

    // Check the value
    status = $('#status').text();
    assert.strictEqual(status, last, "The value should match the last input provided.");
});
QUnit.test("Pass in null", function (assert) {
    // Init
    var status;

    // Set up
    TestUtil.appendStatusBlock();
    updateStatus(null);

    // Check the value
    status = $('#status').text();
    assert.strictEqual(status, "null", "Null input should just display the string 'null'");
});

QUnit.module("updateResults(Array, Array)");
QUnit.test("Pass in empty arrays", function (assert) {
    // Init
    var reds, greens;

    // Set up
    TestUtil.appendResultsBlocks();
    updateResults([], []);

    // Check the value
    reds = $('#reds').text();
    greens = $('#greens').text();
    assert.strictEqual(reds, "", "The reds value should be empty.");
    assert.strictEqual(greens, "", "The greens value should be empty.");
});
QUnit.test("Pass in populated same-size arrays", function (assert) {
    // Init
    var input = {
        a1: [1, 2, 3],
        a2: [4, 5, 6]
    };
    var reds, greens;

    // Set up
    TestUtil.appendResultsBlocks();
    updateResults(input.a1, input.a2);

    // Check the value
    reds = $('#reds').text();
    greens = $('#greens').text();
    assert.strictEqual(reds, "1,2,3", "The reds value should be 1,2,3.");
    assert.strictEqual(greens, "4,5,6", "The greens value should be 4,5,6.");
});
QUnit.test("Pass in small array first", function (assert) {
    // Init
    var input = {
        a1: [1],
        a2: [4, 5, 6, 2]
    };
    var reds, greens;

    // Set up
    TestUtil.appendResultsBlocks();
    updateResults(input.a1, input.a2);

    // Check the value
    reds = $('#reds').text();
    greens = $('#greens').text();
    assert.strictEqual(reds, "1", "The reds value should be 1.");
    assert.strictEqual(greens, "4,5,6,2", "The greens value should be 4,5,6,2.");
});
QUnit.test("Pass in small array second", function (assert) {
    // Init
    var input = {
        a1: [8, 3, 9, 16],
        a2: [2]
    };
    var reds, greens;

    // Set up
    TestUtil.appendResultsBlocks();
    updateResults(input.a1, input.a2);

    // Check the value
    reds = $('#reds').text();
    greens = $('#greens').text();
    assert.strictEqual(reds, "2", "The reds value should be 2.");
    assert.strictEqual(greens, "8,3,9,16", "The greens value should be 8,3,9,16.");
});

QUnit.module("updateInputFields(Array, Array)");
QUnit.test("Pass in empty arrays", function (assert) {
    // Init
    var glowingRed, glowingGreen;

    // Set up
    TestUtil.createNumber(1);
    TestUtil.createNumber(2);
    TestUtil.createNumber(3);
    updateInputFields([], []);

    // Check the value
    glowingRed = $('.glowing-red');
    glowingGreen = $('.glowing-green');
    assert.strictEqual(glowingRed.size(), 0, "There should have been no red matches");
    assert.strictEqual(glowingGreen.size(), 0, "There should have been no green matches");
});
QUnit.test("Verify results on fresh input", function (assert) {
    // Init
    var glowingRed, glowingGreen;

    // Set up
    TestUtil.createNumber(1);
    TestUtil.createNumber(2);
    TestUtil.createNumber(3);
    TestUtil.createNumber(4);
    updateInputFields([3], [1, 2]);

    // Check the value
    glowingRed = $('.glowing-red');
    glowingGreen = $('.glowing-green');
    assert.strictEqual(glowingRed.size(), 1, "There should have been one red match");
    assert.strictEqual($(glowingRed.get(0)).val(), "3", "The red match should be 3");
    assert.strictEqual(glowingGreen.size(), 2, "There should have been two green matches");
    assert.strictEqual($(glowingGreen.get(0)).val(), "1", "The first green match should be 1");
    assert.strictEqual($(glowingGreen.get(1)).val(), "2", "The second green match should be 2");
});
QUnit.test("Verify results on tainted input", function (assert) {
    // Init
    var glowingRed, glowingGreen;

    // Set up
    TestUtil.createNumber(1);
    TestUtil.createNumber(2);
    TestUtil.createNumber(3);
    TestUtil.createNumber(4);
    TestUtil.createNumber(5);
    TestUtil.createNumber(6);
    $('.number').addClass('glowing-red');
    updateInputFields([3], [1, 2]);

    // Check the value
    glowingRed = $('.glowing-red');
    glowingGreen = $('.glowing-green');
    assert.strictEqual(glowingRed.size(), 1, "There should have been one red match");
    assert.strictEqual($(glowingRed.get(0)).val(), "3", "The red match should be 3");
    assert.strictEqual(glowingGreen.size(), 2, "There should have been two green matches");
    assert.strictEqual($(glowingGreen.get(0)).val(), "1", "The first green match should be 1");
    assert.strictEqual($(glowingGreen.get(1)).val(), "2", "The second green match should be 2");
});