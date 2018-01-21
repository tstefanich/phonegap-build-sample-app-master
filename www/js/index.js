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
        zone_id: 1234
      }
    }, function() {
      console.log("Successfully added geofence");
    }, function(error) {
      console.warn("Failed to add geofence", error);
    });
    // Listen to location events & errors.
    bgGeo.on('location', callbackFn, failureFn);
    // Fired whenever state changes from moving->stationary or vice-versa.
    bgGeo.on('motionchange', function(isMoving) {
      console.log('- onMotionChange: ', isMoving);
    });
    // Fired whenever a geofence transition occurs.
    bgGeo.on('geofence', function(geofence) {
      console.log('- onGeofence: ', geofence.identifier, geofence.location);

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
        debug: false,  // <-- Debug sounds & notifications.
        stopOnTerminate: false,
        startOnBoot: true,
        // HTTP / SQLite config
        url: "http://your.server.com/locations",
        method: "POST",
        autoSync: true,
        maxDaysToPersist: 3,
        headers: {  // <-- Optional HTTP headers
            "X-FOO": "bar"
        },
        params: {   // <-- Optional HTTP params
            "auth_token": "maybe_your_server_authenticates_via_token_YES?"
        }
    }, function(state) {
        // This callback is executed when the plugin is ready to use.
        console.log("BackgroundGeolocation ready: ", state);
        if (!state.enabled) {
            bgGeo.start();
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
    }
  };

  app.initialize();
