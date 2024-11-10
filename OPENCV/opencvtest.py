import cv2
import numpy as np
from matplotlib import pyplot as plt

# Paths to the images
image_path1 = 'IMG_3577.JPG'
image_path2 = 'IMG_3578.JPG'

# Load the images
img1 = cv2.imread(image_path1)
img2 = cv2.imread(image_path2)

# Check if images are loaded properly
if img1 is None:
    raise FileNotFoundError(f"Image at path '{image_path1}' could not be loaded.")
if img2 is None:
    raise FileNotFoundError(f"Image at path '{image_path2}' could not be loaded.")

# Resize img2 to match img1 if they have different sizes
if img1.shape != img2.shape:
    print("Images have different sizes. Resizing img2 to match img1.")
    img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]), interpolation=cv2.INTER_AREA)

# Convert the images to grayscale
gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

# Compute the absolute difference between the two grayscale images
diff = cv2.absdiff(gray1, gray2)

# Threshold the difference image to get the regions with significant changes
_, thresh = cv2.threshold(diff, 100, 255, cv2.THRESH_BINARY)

# Apply dilation to make the detected changes more visible
kernel = np.ones((5, 5), np.uint8)
dilated = cv2.dilate(thresh, kernel, iterations=2)

# Find contours of the changes
contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Draw bounding boxes around detected major changes only
img1_with_boxes = img1.copy()
padding = 10  # Padding around the bounding box for better visibility

# Define threshold for major changes
major_threshold = 5000  # Contour area above this is considered major

# List to store (area, bounding box) of major changes
major_changes = []

# Loop through contours to find major changes
for contour in contours:
    area = cv2.contourArea(contour)
    if area > major_threshold:
        (x, y, w, h) = cv2.boundingRect(contour)
        x = max(0, x - padding)
        y = max(0, y - padding)
        w = min(img1.shape[1] - x, w + 2 * padding)
        h = min(img1.shape[0] - y, h + 2 * padding)
        
        # Store bounding box along with its area
        major_changes.append((w * h, (x, y, w, h)))

# Sort by area and keep only the top 3 major changes
top_major_changes = sorted(major_changes, key=lambda x: x[0], reverse=True)[:3]

# Draw bounding boxes for top 3 major changes
for _, (x, y, w, h) in top_major_changes:
    color = (0, 255, 0)  # Green for major changes
    thickness = 10       # Thicker box for major changes
    cv2.rectangle(img1_with_boxes, (x, y), (x + w, y + h), color, thickness)

# Plot the original images and the result with highlighted changes
plt.figure(figsize=(18, 6))

# Show the original image 1
plt.subplot(1, 3, 1)
plt.title("Original Image 1")
plt.imshow(cv2.cvtColor(img1, cv2.COLOR_BGR2RGB))
plt.axis('off')

# Show the original image 2
plt.subplot(1, 3, 2)
plt.title("Original Image 2")
plt.imshow(cv2.cvtColor(img2, cv2.COLOR_BGR2RGB))
plt.axis('off')

# Show the difference with top 3 major changes highlighted
plt.subplot(1, 3, 3)
plt.title("Top 3 Major Changes Highlighted")
plt.imshow(cv2.cvtColor(img1_with_boxes, cv2.COLOR_BGR2RGB))
plt.axis('off')

plt.tight_layout()
plt.show()
