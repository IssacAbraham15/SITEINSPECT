# Import required libraries
import cv2
import numpy as np

# Load the input images
img1 = cv2.imread('IMG_3579.JPG')
img2 = cv2.imread('IMG_3580.JPG')

# Resize images to 640x480
img1 = cv2.resize(img1, (640, 480), interpolation=cv2.INTER_AREA)
img2 = cv2.resize(img2, (640, 480), interpolation=cv2.INTER_AREA)

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
print("Image matching Error between the two images:", error)

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

# Display original images and difference image with highlighted areas
cv2.imshow("Original Image 1", img1)
cv2.imshow("Original Image 2", img2)

cv2.waitKey(0)
cv2.destroyAllWindows()
