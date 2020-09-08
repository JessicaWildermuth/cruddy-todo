const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

//right now, the counter is increasing through the memory using getNextUnique id
//need to make getNextUniqueId read from a file that is stored in HD
exports.create = (text, callback) => {
  //each toDo needs to be written in a file
  //getNextUnique id, needs to return that number
  //now we know that nextUniqueId takes a callback that will interact with out uniqueId
  //so error first, then idNumber as the secondArugment
  counter.getNextUniqueId((err, id) => {
    //with this idNumber we want to create a new toDo file that is stored in the data directory with the id as the file path
    //write a file, join the paths of the dataDir, and the idNumber as the name ofthe text fule
    //the second arugmnet is the data that needs to be written - the learn says only store the to do text in the file
    //third argumnet is a callback, error first, but after we write the file, we want to post the text to the UI
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      callback(null, { id, text });
    });
  });
};

exports.readAll = (callback) => {
  //need to read over all the data files in the data directory
  //readdir reacs the contents of a director,
  //needs path as first argument, then cb with error first and the files of the directory as the second argument
  //files here is an array of all the file names in the directoty
  fs.readdir(exports.dataDir, (err, files) => {
    if (!files.length) {
      callback(null, []);
    } else {
      var fileContents = _.map(files, function(file) {
        return {id: file.slice(0, 5), text: file.slice(0, 5)};
      });
      //right now is returning an array of file names, but instead want an array of objects where each object is one file and each object has a key value pairs (id and text with value both being idNumber)
      callback(null, fileContents);
    }
  });
};

exports.readOne = (id, callback) => {
  //need to find the file based on the id so we know readdir gives us a list of all the files with their name which is there id
  //so if the id plus .txt is in the array,
  //we read that file
  //can probably skip reading through whole directory
  // fs.readdir(exports.dataDir, (err, files) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: text.toString()});
    }
  });
};




exports.update = (id, text, callback) => {
  //retwrite the text stored in a toDO based on its id
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err, text) => {
        callback(null, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
