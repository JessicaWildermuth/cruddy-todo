const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};


//take a callback as its argument
//readFile() reads the contents of the file stored at the passed in path (as first argument), and then takes in a callback with error first and the data second, and then uses the data as the argument for the callback function passed in
//im assuming in terms of error, that since the data is set to 0, that that would indicate that the fileData counter doesnt exist yet so the count is zero
const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

//take in a count and a call back
//writes a counter string using the zeroPadded function and the count
//then uses write file, using the exported file path here to 'counter.txt', take in the data (aka the counter string), and a callback that take in an error
//if the error is truthy, it throws an error
//else, it uses the callback in the write counter function on the counterString
const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

//need to save the current counter to a file in data
//use the readCounter and WriteCounter functions
//best to look at those functions to determine what they do
exports.getNextUniqueId = (callback) => {
  //im writing a counter.text file
  //cant my callback just return the counter string?
  //goal was to save the counter to the hardDrive. Right now it is saved to the hardDrive
  //need to someone get the data that is a string to the returned to the nextUniqueId
  //does a callback return to the function that called it
  // so readcounter take a call back,(always error first and what I want to get out of this is the filedata, so that should be my second arugment)
  readCounter((err, filedata) => {
    //that callback function should invoke the write counter function that willt ake the fileData passed in from reading the file, and incrementing the count of it by one, since we are looking for a unique id
    //write counter also take a call bacl that interacts with this data
    //in write counter, the filedata + 1 is being converted into a counter string for our id tag of our to dos
    //to get the unique id back to the create all that invoked get NextUniqueId, we need to use a callback that returns that data
    //so again, error first, so first arg is an error, and the second arugument should be the idNumber for the new todo
    writeCounter(filedata + 1, (err, id) => {
      //now we need to return the idNumber using the callback from our original function call to
      //again, error first, then data
      callback(err, id);
    });
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
