/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


  var app = {
    // Application Constructor
    registrationId: null,
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
      app.setupPush(); 
      // setupBackGroundGeolocation happens after push has been registered


    },
    setupBackgroundGeolocation:function(){






       // Get a reference to the plugin.
    var bgGeo = window.BackgroundGeolocation;
    console.log(bgGeo);

    //This callback will be executed every time a geolocation is recorded in the background.
    var callbackFn = function(location) {
        var coords = location.coords;
        var lat    = coords.latitude;
        var lng    = coords.longitude;
        console.log('- Location: ', JSON.stringify(location));        
    };


        ///
        //42.7012117,-73.1168885,

        ///
    // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
    var failureFn = function(errorCode) {
        console.warn('- BackgroundGeoLocation error: ', errorCode);
    }

    
    // Listen to location events & errors.
    bgGeo.on('location', callbackFn, failureFn);
    // Fired whenever state changes from moving->stationary or vice-versa.
    bgGeo.on('motionchange', function(isMoving) {
      console.log('- onMotionChange: ', isMoving);
    });
    // Fired whenever a geofence transition occurs.
    bgGeo.on('geofence', function(geofence) {
      console.log('- onGeofence: ', geofence.identifier, geofence.location);
      if ("Notification" in window) {
        Notification.requestPermission(function (permission) {
        // If the user accepts, let’s create a notification
        if (permission === "granted") {
        var notification = new Notification("My title", {
           tag: "message1", 
           body: "My body" 
        }); 
          notification.onshow  = function() { console.log('show'); };
          notification.onclose = function() { console.log('close'); };
          notification.onclick = function() { console.log('click'); };
        }
        });
    }
    });
    // Fired whenever an HTTP response is received from your server.
    bgGeo.on('http', function(response) {
      console.log('http success: ', response.responseText);
    }, function(response) {
      console.log('http failure: ', response.status);
    });

    // BackgroundGeoLocation is highly configurable.
    bgGeo.configure({
        // Geolocation config
        desiredAccuracy: 0,
        distanceFilter: 10,
        stationaryRadius: 25,
        // Activity Recognition config
        activityRecognitionInterval: 10000,
        stopTimeout: 5,
        // Application config
        debug: false ,  // <-- Debug sounds & notifications.
        stopOnTerminate: false,
        startOnBoot: true,
        // HTTP / SQLite config
        url: "http://games.ucla.edu/darkgame/currentIP.php",
        method: "POST",
        httpRootProperty: 'data',
        autoSync: true,
        forceReloadOnGeofence:true,
        foregroundService: true,
        maxDaysToPersist: 3,
        /*headers: {  // <-- Optional HTTP headers
            "X-FOO": "bar"
        },*/
        params: {   // <-- Optional HTTP params
            "registrationId": app.registrationId

        }
    }, function(state) {
        // This callback is executed when the plugin is ready to use.
        console.log("BackgroundGeolocation ready: ", state);
        if (!state.enabled) {
            bgGeo.start();
            bgGeo.addGeofence({
      identifier: "Studios",
      radius: 300,
      latitude: 42.7012117,
      longitude: -73.1168885,
      notifyOnEntry: true,
      notifyOnExit: false,
      notifyOnDwell: true,
      loiteringDelay: 30000,  // 30 seconds
      extras: {               // Optional arbitrary meta-data
        zone_id: 1234,
      }
    }, function() {
      console.log("Successfully added geofence");
    }, function(error) {
      console.warn("Failed to add geofence", error);
    });
        }
    });

    // The plugin is typically toggled with some button on your UI.
    function onToggleEnabled(value) {
        if (value) {
            bgGeo.start();
        } else {
            bgGeo.stop();
        }
    }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "344217977904"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);
            app.registrationId = data.registrationId;
            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');


            app.setupBackgroundGeolocation();
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
           // navigator.notification.alert(
           //     data.message,         // message
           //     null,                 // callback
           //     data.title,           // title
           //     'Ok'                  // buttonName
           // );
       });
    }
  };

  app.initialize();
