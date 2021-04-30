import sys
import cv2
import numpy as np
from prettytable import PrettyTable

# main acts as a launch area for the script
def main():
        ROI()

# Runs the ROI Function
def ROI():

        if __name__ == '__main__':

                # Read image
                inputImage = cv2.imread( 'C:\\Users\\James\\Desktop\\SeamlessCloning\\SCImages\\NORMAL\\-NORMAL-OutputTicket+wood.jpg')

                # Select ROI
                showCrosshair = True
                fromCenter = False
                r = cv2.selectROI(inputImage, fromCenter)

                # Crop image
                croppedImage = inputImage[int(r[1]):int(r[1] + r[3]), int(r[0]):int(r[0] + r[2])]

                # Display cropped image
                cv2.imshow("Region of interest selected for Image", croppedImage)
                cv2.waitKey(0)

        #pass over the croppedImage to RGBChannels
        RGBChannels(croppedImage)

# Runs the RGB function
def RGBChannels(croppedImage):

       # Reads in the image using CV2
       imageToSplit = croppedImage
       averageRGB = croppedImage
       greyScale = croppedImage
       imageHeight = imageToSplit.shape[0]
       imageWidth = imageToSplit.shape[1]

       # sets the default values to 0
       minimumBlueChannelValue = 0
       maximumBlueChannelValue  = 0
       minimumGreenChannelValue  = 0
       maximumGreenChannelValue  = 0
       minimumRedChannelValue  = 0
       maximumRedChannelValue  = 0

       for y in range(imageHeight):  # by row
               for x in range(imageWidth):  # by column

                       blueChannel = imageToSplit[y, x, 0]  # return blue channel
                       greenChannel = imageToSplit[y, x, 1]  # return green channel
                       redChannel = imageToSplit[y, x, 2]  # return red channel

                       # checks every value and replaces the higest pixel if value is higher
                       if redChannel > maximumRedChannelValue :

                               maximumRedChannelValue  = redChannel

                       if redChannel < minimumRedChannelValue :

                               minimumRedChannelValue  = redChannel

                       if greenChannel > maximumGreenChannelValue :

                               maximumGreenChannelValue  = greenChannel

                       if greenChannel < minimumGreenChannelValue :

                               minimumGreenChannelValue  = greenChannel

                       if blueChannel > maximumBlueChannelValue :

                               maximumBlueChannelValue  = blueChannel

                       if blueChannel < minimumBlueChannelValue :

                               minimumBlueChannelValue  = blueChannel

       #creates averages of the all the RGB values
       averageRGB = cv2.cvtColor(averageRGB, cv2.COLOR_BGR2RGB)  # convert it to RGB channel
       average = np.average(averageRGB, axis=(0, 1))

     #grey scales conversion
       grey = cv2.cvtColor(greyScale, cv2.COLOR_BGR2GRAY)


       print('\n')
       # Prints the values
       print("----------------------------------------------------------")
       print("Split Channel values of RGB:")

       #creates pretty table
       RGBValuesTable = PrettyTable()

       #creates the rows and columns in the table
       RGBValuesTable .field_names = ["Channel:", "Highest", "Lowest"]
       RGBValuesTable .add_row(["Red:", maximumRedChannelValue, minimumRedChannelValue])
       RGBValuesTable .add_row(["Green:", maximumGreenChannelValue, minimumGreenChannelValue])
       RGBValuesTable .add_row(["Blue:", maximumBlueChannelValue, minimumBlueChannelValue])

       #Creates
       print(RGBValuesTable )

       #Shows the averages of the RGB values
       print("Average RGB values of ROI :", average,)
       print("----------------------------------------------------------")

       print("GreyScale Values:")
       print(grey)
       print('\n')

''' 
#--> output instead of PrettyTable library
print("Min Red channel :", minimumRedChannelValue)
print("Max Red channel : ", maximumRedChannelValue)
print("Min Green channel ", minimumGreenChannelValue)
print("Max Green channel :", maximumGreenChannelValue)
print("Min Blue channel :", minimumBlueChannelValue)
print("Max Blue channel :", maximumBlueChannelValue)
averageRGB(croppedImage)

'''

def avereageRGB(croppedImage):
    averageRGB = croppedImage
    averageRGB = cv2.cvtColor(averageRGB, cv2.COLOR_BGR2RGB)  # convert it to RGB channel
    average = np.average(averageRGB, axis=(0, 1))
    print(average)
    

main()
quit()
