angular.module('DiseaseRegistry.controllers', [])

  .controller('AppCtrl', function ($scope, $http) {

    $scope.conditionList = [
      {text: "Condition 1", checked: false},
      {text: "Condition 2", checked: false},
      {text: "Condition 3", checked: false}
    ];

    var length = $scope.conditionList.length;
    var data = [];
    $scope.post_cohort = {'name': '', 'id': ''};
    $scope.visible = false;


    var afterDelete = function (cohort) {
      $scope.cohorts.splice($scope.cohorts.indexOf(cohort), 1);
    };

    var onComplete = function (response) {
      $scope.cohorts = response.data;
      //console.log($scope.cohorts);
    };

    $scope.getCohort = function (cohort) {
      //$scope.c = cohort;
      $scope.cohort_name = cohort.name;
      $scope.cohortId = cohort.id;
      $scope.conditions = cohort.conditions;
      $scope.cohort_id = cohort._id;
    };
    //$scope.getAllCohorts = function () {

    $scope.doRefresh = function () {

      $http.get("http://disease-registry-58009.onmodulus.net/api/Cohorts")
        .success(function (data) {
          $scope.cohorts =data;
          $scope.$broadcast('scroll.refreshComplete');
      });
    };

    var afterPOST = function () {
      $scope.post_cohort.name = '';
      $scope.post_cohort.id = '';
      for (var i = 0; i < length; i++) {
        if ($scope.conditionList[i].checked)
          $scope.conditionList[i].checked = false;
      }
    };


    $scope.createCohort = function () {
      var conditions = [];
      for (var i = 0; i < length; i++) {
        if ($scope.conditionList[i].checked)
          conditions.push({name: $scope.conditionList[i].text});
      }

      data = {'name': $scope.post_cohort.name, 'id': $scope.post_cohort.id, 'conditions': conditions};
      //console.log(data);
      $http.post("http://disease-registry-58009.onmodulus.net/api/Cohorts", data).then(afterPOST);
    };


    $scope.deleteCohort = function (cohort) {
      var url = "http://disease-registry-58009.onmodulus.net/api/Cohorts/" + cohort._id;
      $http.delete(url).then(afterDelete(cohort));
    };
    $http.get("http://disease-registry-58009.onmodulus.net/api/Cohorts").then(onComplete);


  });
