import cv2
import numpy as np

if __name__ == '__main__':
        # Read image
        im = cv2.imread('C:\\Users\\James\\Desktop\\SeamlessCloning\\SCImages\\Mixed\\-MIXED-OutputMixedKitchen+Flowers.jpg')
        # Select ROI
        showCrosshair = False
        fromCenter = False
        r = cv2.selectROI(im, fromCenter)
        # Crop image
        imCrop = im[int(r[1]):int(r[1] + r[3]), int(r[0]):int(r[0] + r[2])]
        # Display cropped image
        cv2.imshow("Image", imCrop)
        cv2.waitKey(0)
