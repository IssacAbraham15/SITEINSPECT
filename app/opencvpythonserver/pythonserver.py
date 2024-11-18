from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
import os
import zipfile

# Set base directory and upload folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Absolute path to the current file
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')      # Ensure uploads folder is absolute
os.makedirs(UPLOAD_FOLDER, exist_ok=True)              # Create the folder if it doesn't exist

app = Flask(__name__)

@app.route('/compare-photos', methods=['POST'])
def compare_photos():
    try:
        # Get images from request
        if 'currentPhoto' not in request.files or 'previousPhoto' not in request.files:
            return jsonify({"error": "Missing images in the request"}), 400

        file1 = request.files['currentPhoto']
        file2 = request.files['previousPhoto']

        # Save the images locally
        file1_path = os.path.join(UPLOAD_FOLDER, 'current.jpg')
        file2_path = os.path.join(UPLOAD_FOLDER, 'previous.jpg')
        file1.save(file1_path)
        file2.save(file2_path)

        # Load the input images
        img1 = cv2.imread(file1_path)
        img2 = cv2.imread(file2_path)

        if img1 is None or img2 is None:
            return jsonify({"error": "One or both images could not be read"}), 400

        # Resize images to 640x480
        img1 = cv2.resize(img1, (1080, 1920), interpolation=cv2.INTER_AREA)
        img2 = cv2.resize(img2, (1080, 1920), interpolation=cv2.INTER_AREA)

        # Convert the images to grayscale
        gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
        gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

        # Define the function to compute MSE between two images
        def mse(img1, img2):
            h, w = img1.shape
            diff = cv2.subtract(img1, img2)
            err = np.sum(diff**2)
            mse = err / (float(h * w))
            return mse, diff

        # Compute MSE and the difference image
        error, diff = mse(gray1, gray2)

        # Threshold the difference image to get significant changes
        _, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

        # Find contours of the differences
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Draw a rectangle around the major difference
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            if cv2.contourArea(largest_contour) > 100:  # Filter by minimum area
                x, y, w, h = cv2.boundingRect(largest_contour)
                cv2.rectangle(img1, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Draw rectangle on img1

        # Save the processed images
        processed_img1_path = os.path.join(UPLOAD_FOLDER, 'processed_current.jpg')
        processed_img2_path = os.path.join(UPLOAD_FOLDER, 'processed_previous.jpg')
        cv2.imwrite(processed_img1_path, img1)  # Save img1 with rectangles
        cv2.imwrite(processed_img2_path, img2)  # Save the resized img2 (unaltered)

        # Create a zip file containing both images
        zip_path = os.path.join(UPLOAD_FOLDER, 'processed_images.zip')
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            zipf.write(processed_img1_path, arcname='processed_current.jpg')
            zipf.write(processed_img2_path, arcname='processed_previous.jpg')

        # Return the zip file
        return send_file(zip_path, mimetype='application/zip', as_attachment=True, download_name='processed_images.zip')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='10.152.137.119', port=5000)
