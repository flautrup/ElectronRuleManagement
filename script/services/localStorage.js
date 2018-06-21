//Service to manage logal storage of rule packages
service.factory('localStorage', function () {
  // Add support for reading and storing local storage.
  var localpackagelist = [];

  const dialog = remote.dialog;

  return {
    get: function ($scope) {
      tmppackagelist = JSON.parse(localStorage.getItem(
        'localpackagelist'));
      if (tmppackagelist == null) {
        localpackagelist = [];
      } else {
        localpackagelist = tmppackagelist;
        $scope.packageList = localpackagelist;
      }

    },
    set: function (rulePackage) {
      //check if already exsists
      var count = 0;
      var duplicate = false;

      while (!duplicate && count < localpackagelist.length) {
        if (localpackagelist[count].packageName === rulePackage.packageName) {
          duplicate = true;
        } else {
          count++;
        }
      }

      if (count == localpackagelist.length) {
        localpackagelist.push(rulePackage);
        localStorage.setItem('localpackagelist', JSON.stringify(localpackagelist));
        return localpackagelist;
      } else {
        return localpackagelist;
      }
    },
    delete: function (rulePackage) {
      var index = 0;
      while (localpackagelist[index].packageName != rulePackage.packageName) {
        index++;
      }
      localpackagelist.splice(index, 1);
      localStorage.setItem('localpackagelist', JSON.stringify(localpackagelist));
      return localpackagelist;
    },
    export: function () {
      tmppackagelist = JSON.parse(localStorage.getItem(
        'localpackagelist'));

      if (tmppackagelist == null) {
        list = [];
      } else {
        list = tmppackagelist;
      }

      var result = angular.toJson(list);

      //Save file
      dialog.showSaveDialog((fileName) => {

        fs.writeFile(fileName, result, (err) => {
          if (fileName === undefined) {
            console.log("File not saved");
            return;
          }
        })

      })
    },
    import: function ($scope) {
      //Open file
      dialog.showOpenDialog((fileName) => {

        fs.readFile(fileName[0], 'utf-8', (err, data) => {
          if (err) {
            console.log("File not read " + err.message);
            return;
          }

          console.log(data);

          loadedpackagelist = JSON.parse(data);
          //console.log(loadedpackagelist);
          for (var count = 0; count < loadedpackagelist.length; count++) {
            localpackagelist.push(loadedpackagelist[count]);
          }


          localStorage.setItem('localpackagelist', JSON.stringify(localpackagelist));

          $scope.packageList = localpackagelist;
          $scope.$apply();


        })
      })
      //load list, merge lists and store.
    }
  };

});