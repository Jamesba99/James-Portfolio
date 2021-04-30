import cv2
import numpy as np
import time
def main():
    greyscale()
def greyscale():
    croppedImage = cv2.imread('C:\\Users\\James\\Desktop\\SeamlessCloning\\TestImages\\smallerImage\\sun.png')
    greyScale = croppedImage

    grey = cv2.cvtColor(greyScale, cv2.COLOR_BGR2GRAY)
    #cv2.imshow("image", grey)
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()

    imageToSplit = grey

    greyHigh = 0
    greyLow = 0
    imageHeight = imageToSplit.shape[0]
    imageWidth = imageToSplit.shape[1]
    for y in range(imageHeight):  # by row
        for x in range(imageWidth):  # by column
         greyChannel = imageToSplit[y, x,]

         if greyChannel > greyHigh:

            greyHigh = greyChannel

         if greyChannel < greyLow:
                greyLow = greyChannel
    average = np.average(grey,axis=(0,1) )
    print("full image scanned")
    #time.sleep(1)
    print("High: ", greyHigh)
    print("LOW: ", greyLow)
    print("Average: ", average)
    #ROI(greyHigh, greyLow, average, grey)

def ROI(greyHigh, greyLow, average, grey):
    if __name__ == '__main__':
        # Read image
        inputImage = grey

        # Select ROI
        showCrosshair = True
        fromCenter = False
        r = cv2.selectROI(inputImage, fromCenter)

        # Crop image
        croppedImage = inputImage[int(r[1]):int(r[1] + r[3]), int(r[0]):int(r[0] + r[2])]

        # Display cropped image
        cv2.imshow("Region of interest selected for Image", croppedImage)
        cv2.waitKey(0)
    imageToSplit = croppedImage

    greyHighROI = 0
    greyLowROI = 0
    imageHeight = imageToSplit.shape[0]
    imageWidth = imageToSplit.shape[1]
    for y in range(imageHeight):  # by row
        for x in range(imageWidth):  # by column
            greyChannelROI = imageToSplit[y, x]

            if greyChannelROI > greyHighROI:
                greyHighROI = greyChannelROI

            if greyChannelROI < greyLowROI:
                greyLowROI = greyChannelROI
    averageROI = np.average(imageToSplit, axis=(0, 1))

    print("KEY: 0= Black, 128= grey, 255 = white")
    print("--------------------------")
    print("ROIHIGH:", greyHighROI)
    print("ROILOW", greyLowROI)
    print("AVERAGEROI :", averageROI)
    print("--------------------------")
    print("High: ", greyHigh)
    print("LOW: ", greyLow)
    print("Average: ", average)

    # pass over the croppedImage to RGBChannels

main()