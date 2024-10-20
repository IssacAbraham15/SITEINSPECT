import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Radar = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  function goBack() {
    router.back()
  }


  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      setHasLocationPermission(true);

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    };

    requestLocationPermission();
  }, []);

  const radarHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Radar Navigation with Stylized Arrow</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #e0f7fa;
        }
        canvas {
          border: 5px solid #00796b;
          background-color: #ffffff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .distance {
          font-size: 24px;
          color: #004d40;
          margin-top: 15px;
          text-align: center;
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      <div id="radar-container">
        <canvas id="radar" width="300" height="300"></canvas>
        <div class="distance" id="distance"></div>
      </div>
      <script>
        const canvas = document.getElementById("radar");
        const ctx = canvas.getContext("2d");
        const distanceDisplay = document.getElementById("distance");
        const destination = {
          lat: 25.307835,  // Destination latitude
          lng: 55.339725, // Destination longitude
        };
        let bounceOffset = 0;
        let bounceDirection = 1;

        function degreesToRadians(degrees) {
          return degrees * (Math.PI / 180);
        }

        function calculateDistance(lat1, lon1, lat2, lon2) {
          const R = 6371e3;  // Earth radius in meters
          const lat1Rad = degreesToRadians(lat1);
          const lat2Rad = degreesToRadians(lat2);
          const diffLat = degreesToRadians(lat2 - lat1);
          const diffLong = degreesToRadians(lon2 - lon1);
          const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
                    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                    Math.sin(diffLong / 2) * Math.sin(diffLong / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        }

        function calculateBearing(lat1, lon1, lat2, lon2) {
          const lat1Rad = degreesToRadians(lat1);
          const lat2Rad = degreesToRadians(lat2);
          const diffLong = degreesToRadians(lon2 - lon1);
          const y = Math.sin(diffLong) * Math.cos(lat2Rad);
          const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
                    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(diffLong);
          const bearing = Math.atan2(y, x);
          return (bearing * (180 / Math.PI) + 360) % 360;
        }

        function updateArrow(bearing) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw the transparent green square
          ctx.fillStyle = "rgba(102, 187, 106, 0.3)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Adjust bounceOffset for the bounce effect
          if (bounceOffset > 15) bounceDirection = -1;  // Limit the bounce range
          if (bounceOffset < -15) bounceDirection = 1;
          bounceOffset += bounceDirection * 1;  // Speed of the bounce

          // Save the current context state
          ctx.save();
          // Translate to the center of the canvas
          ctx.translate(canvas.width / 2, canvas.height / 2);

          // Calculate bounce in the direction of the arrow
          const bounceDistanceX = bounceOffset * Math.cos(degreesToRadians(bearing));
          const bounceDistanceY = bounceOffset * Math.sin(degreesToRadians(bearing));
          
          // Move in the direction of the arrow's bearing
          ctx.translate(bounceDistanceX, -bounceDistanceY);

          // Rotate the canvas based on the bearing (pointing direction)
          ctx.rotate(degreesToRadians(bearing));

          // Draw the arrow
          ctx.beginPath();
          ctx.moveTo(0, -70);  // Arrow tip
          ctx.lineTo(25, 40);  // Bottom right
          ctx.lineTo(0, 20);   // Middle point
          ctx.lineTo(-25, 40); // Bottom left
          ctx.closePath();

          ctx.fillStyle = "#66bb6a";  // Lighter green
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 10;
          ctx.fill();
          
          // Restore the context state
          ctx.restore();
        }

        function initializeRadar(lat, lng) {
          const distance = calculateDistance(lat, lng, destination.lat, destination.lng);
          distanceDisplay.textContent = Math.round(distance) + ' meters to destination';
          const bearing = calculateBearing(lat, lng, destination.lat, destination.lng);
          updateArrow(bearing);
        }

        if (${userLocation ? true : false}) {
          initializeRadar(${userLocation ? userLocation.latitude : 0}, ${userLocation ? userLocation.longitude : 0});
        } else {
          console.error("Location not available");
        }

        // Animation loop to keep the arrow bouncing
        function animate() {
          if (${userLocation ? true : false}) {
            initializeRadar(${userLocation ? userLocation.latitude : 0}, ${userLocation ? userLocation.longitude : 0});
          }
          requestAnimationFrame(animate);
        }

        animate();  // Start the animation loop
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView className="flex-1 bg-secondary-102">
      <TouchableOpacity className='left-5 p-2' onPress={goBack}>
          <FontAwesome name="arrow-left" size={30} color="#800E13" />
      </TouchableOpacity>
      {hasLocationPermission && (
        <WebView
          originWhitelist={['*']}
          source={{ html: radarHTML }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={{ flex: 1 }}
        />
      )}
    </SafeAreaView>
  );
};

export default styled(Radar);