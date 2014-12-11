define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('Home', ['$scope','$stateParams','$http','$window','$state','jsonData',function ($scope, $stateParams,$http,$window,$state,jsonData) {
    
    //function used to generate and update data for all the charts on this page
    $scope.update = function(){
    //using json service to gather all the data from input file
      jsonData.getItems()
        .then(function(data){
        
        /* Manipulating the data from json output to match inputs for charts and tables*/
          var activeUsersData = data[0];
          var totalUsersData = data[1];
          var totalUserArray = [],activeUserArray = [],ratio = [], activeAverage = 0,activeMax=0,totalAverage = 0,totalMax=0,activeDateMax =0,activeDateMin = 0;
          activeUsersData.day.forEach(function(value){
            var date=new Date(value['@date']);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setHours(0);
            date.setMilliseconds(0);
            var epoch = date.getTime();
            
            var val = parseInt(value['@value']);
            if($('#start').val() =="" || $('#end').val() ==""){
              activeUserArray.push({x:epoch,y: val});
              
            }
            else{
              var start=new Date($('#start').val());
              var end=new Date($('#end').val());
              end.setMinutes(0);
              end.setSeconds(0);
              end.setHours(0);
              end.setMilliseconds(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setHours(0);
              start.setMilliseconds(0);
              var startEpoch = start.getTime();
              var endEpoch = end.getTime();
              if(epoch>=startEpoch && epoch<=endEpoch)
                activeUserArray.push({x:epoch,y: val});
            }
          });
          
          totalUsersData.day.forEach(function(value){
            var date=new Date(value['@date']);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setHours(0);
            date.setMilliseconds(0);
            var epoch = date.getTime();;
            var val = parseInt(value['@value']);
            if($('#start').val() =="" || $('#end').val() == ""){
              totalUserArray.push({x:epoch,y: val});
            }
            else{
              var start=new Date($('#start').val());
              var end=new Date($('#end').val());
              end.setMinutes(0);
              end.setSeconds(0);
              end.setHours(0);
              end.setMilliseconds(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setHours(0);
              start.setMilliseconds(0);
              var startEpoch = start.getTime();
              var endEpoch = end.getTime();
              if(epoch>=startEpoch && epoch<=endEpoch)
                totalUserArray.push({x:epoch,y: val});
            }
          });
          
          //setting min and max for total and active users of specified time frame
          var activeMin = activeUserArray[0].x,totalMin = totalUserArray[0].x;
          
          /*checking if inputs are empty and setting their values to the start and end of the total users array.  Using total users array because there
          can be a case where active users is 0 but total is not*/
          if($('#start').val() =="" || $('#end').val() ==""){
            $('#start').val(moment(new Date(totalUserArray[0].x)).format('MM/DD/YYYY'));
            $('#end').val(moment(new Date(totalUserArray[totalUserArray.length-1].x)).format('MM/DD/YYYY'));
          }
          
          //creating ratio array for line chart input
          totalUserArray.forEach(function(totalVal){
            activeUserArray.forEach(function(activeVal){
              if(activeVal.x == totalVal.x){
                var ratioVal= activeVal.y/totalVal.y;
                ratio.push({x:activeVal.x,y:ratioVal});
                totalAverage += totalVal.y;
                activeAverage += activeVal.y;
                if(totalVal.y >= totalMax)
                  totalMax = totalVal.y;
                if(activeVal.y >= activeMax){
                  activeMax = activeVal.y;
                  activeDateMax = activeVal.x;
                }
                if(totalVal.y <= totalMin)
                  totalMin = totalVal.y;
                if(activeVal.y <= activeMin){
                  activeMin = activeVal.y;
                  activeDateMin = activeVal.x;
                }
              }
            });
             
          
          });
          
          //completing calculation of average values
          totalAverage = totalAverage/totalUserArray.length;
          activeAverage = activeAverage/activeUserArray.length;
          
          //creating the variables for the table section
          $scope.tableData = [];
          $scope.activeAverage = (""+Math.round(activeAverage)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          $scope.totalAverage = (""+Math.round(totalAverage)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          $scope.totalMax = (""+totalMax).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          $scope.totalMin = (""+totalMin).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          $scope.activeMax = (""+activeMax).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          $scope.activeMin = (""+activeMin).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          $scope.activeDateMax = moment(new Date(activeDateMax)).format('MM/DD/YYYY');
          $scope.activeDateMin = moment(new Date(activeDateMin)).format('MM/DD/YYYY');
        

          //Line chart data should be sent as an array of series objects.
          $scope.linedata = [
            {
              values: ratio,      //values - represents the array of {x,y} data points
              key: 'Ratio', //key  - the name of the series.
              color: '#5fafe4'  //color - optional: choose your own line color.
            },
            
          ];
          
          //creating data for the percent change pie chart  checking if arrays are empty.  If so then pass empty chart data to pie chart
          if(totalUserArray.length >0 || activeUserArray.length>0){
            var totalDiff = totalUserArray[totalUserArray.length-1].y - totalUserArray[0].y;
            if(totalDiff < 0){
              totalDiff*=-1;
              $scope.totalLabel = "-";
            }else{
              $scope.totalLabel = "+";
            }
            
            var percentChangeTotal = ((totalDiff/totalUserArray[0].y) *100)/totalUserArray.length; 
            $scope.totalLabel += (Math.round(percentChangeTotal*100)/100).toFixed(2)+ "%";
            
            var activeDiff = activeUserArray[activeUserArray.length-1].y - activeUserArray[0].y;
            if(activeDiff < 0){
              activeDiff*=-1;
              $scope.activeLabel = "-";
            }else{
              $scope.activeLabel = "+";
            }
            
            var percentChangeActive = ((activeDiff/activeUserArray[0].y) *100)/activeUserArray.length; 
            $scope.activeLabel += (Math.round(percentChangeActive *100)/100).toFixed(2) + "%";
            
            //$scope variable to be passed to the pie chart
            $scope.piedata = [
                  { 
                    "label": "Total Users % Change",
                    "value" : percentChangeTotal
                  } , 
                  { 
                    "label": "Active Users % Change",
                    "value" : percentChangeActive
                  } 
                ];
          }else{
            $scope.piedata = [];
            $scope.activeLabel = "-";
            $scope.totalLabel = "-";

          }
          
          
        });
        
    };
    
    //executed for initial page load
    $scope.update();

	}]);
});