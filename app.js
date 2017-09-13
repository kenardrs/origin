var app = angular.module('myApp', []);

app.controller('MainCtrl', function($scope,$http) {
  $scope.name = 'World';
  $scope.files = [];

  // $scope.uploadUrlService = "http://localhost:7001/RestUploadFile2PdfApi-1.0-SNAPSHOT/rest/v1/upload";
  $scope.uploadUrlService = "http://localhost:7001/ima-pj-api-1.0/rest/v1/converterImagensParaPdf";
  $scope.upload=function(){
    return uploadAR($scope.uploadUrlService);

    function uploadAR(url){
      var _fileInput   = document.getElementById('fileInput');
      var file = _fileInput.files[0];
      var imageType = /image.*/;

      // Create FormData to send in the request
      var formData = new FormData();

      // Create Blob for the second part (application/octet-stream)
      var fileBlob = new Blob(
          [file],
          {type: 'application/octet-stream'}
      );

      //Append fileStream to formData
      formData.append('fileData', fileBlob);

      formData.append('name', file.name);

      return $http.post(url, formData, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
      })
      .success(function(){
        console.log("ok");
      })
      .error(function(){
        console.log("fail");
      });

    }

  function uploadFileJson(file, url) {
    var formElement = document.querySelector("form");
    var fd = new FormData(formElement);
    fd.append('file',file);
    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:7001/ima-pj-api-1.0/rest/v1/converterImagensParaPdf");
    request.send(fd);
  }

  function uploadFileMP(file, url){
    var fd = new FormData();
    fd.append('file', file)
    fd.append('name', file.name);

    return $http.post(url, fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    })
    .success(function(){
      console.log("ok");
    })
    .error(function(){
      console.log("fail");
    });
  }

}

});



app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                       // File Name
                        name: item.name,
                        //File Size
                        size: item.size,
                        //File URL to view
                        url: URL.createObjectURL(item),
                        // File Input Value
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);
