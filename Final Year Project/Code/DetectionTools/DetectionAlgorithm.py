import sys
import cv2
import numpy as np
from prettytable import PrettyTable
import time
import os

# main acts as a launch area for the script
# ---------------------------------- def Main ---------------------------------------------------------------------------
'''
@description 
'''


def main():
    collectImage()


# ---------------------------------Image collection/input ---------------------------------------------------------------
'''
@description 
'''


def collectImage():
    image = cv2.imread('C:\\Users\\James\\Desktop\\SeamlessCloning\\TestImages\\backGround\\sky.jpg')  # reads in image
    chooseDetection(image)



# --------------------------------- Choose detection type---------------------------------------------------------------
'''
@description 
'''


def chooseDetection(image):
    passedImage = image  # inputted image from previous function
    print("----------------------------------------------------")
    print("A TOOL TO DETECT SEAMLESSLY CLONED IMAGES")
    print("----------------------------------------------------")
    print("Which detection type do you want to use?")
    print("1. ROI (Region of interest)")
    print("2. Full Image")
    print("3. User Guide (TERMINAL ONLY)")
    print("4. Exit")
    print("--------")

    inputOption = int(input("Enter a number: "))



    if inputOption == 1:  # option to choose which detection technique will be used
        print("---------------------------------------------------")
        print("Do you want to continue?")  # next question is asked
        print("1. yes ")
        print("2. no ")
        print("--------")
        roiInput = str(input("Enter your answer here: "))

        if roiInput == 'yes':

            ROI(passedImage, image)  # moves to ROI function

        elif roiInput == 'No':
            endOfProgram()

        else:
            print("\n")
            print("This is not a valid answer! - Try Again!")
            chooseDetection(image)  # returns to previous question

    elif inputOption == 2:
        print("---------------------------------------------------")
        print("Do you want to continue?")
        print("1. yes ")
        print("2. no ")
        print("--------")

        roiInput = str(input("Enter Answer here: "))

        if roiInput == 'yes':

            FullImage(passedImage, image)

        elif roiInput == 'No':

            chooseDetection(passedImage)
        else:

            print("This is not a valid answer")

            chooseDetection(image)

    elif inputOption == 3:
        userguide(image)

    elif inputOption == 4:

        endOfProgram()

    else:
        print("\n")
        print("This is not a valid option! - Try again!")
        print("\n")

        chooseDetection(image)


# --------------------------------- ROI detection option----------------------------------------------------------------
'''
@description 
'''


def ROI(passedImage, image):
    print("---------------------------------------------------")
    print("Please Open Pop up Window")
    roiAdded = passedImage

    if __name__ == '__main__':
        # Read image
        im = roiAdded
        showCrosshair = False
        fromCenter = False
        r = cv2.selectROI(im, fromCenter)
        # Crop image
        CroppedImage = im[int(r[1]):int(r[1] + r[3]), int(r[0]):int(r[0] + r[2])]
        # Display cropped image
        cv2.imshow("Image", CroppedImage)
        cv2.waitKey(0)
    RGBCollectionsROI(CroppedImage, image)
    cv2.destroyAllWindows()


# --------------------------------- Full Image option-------------------------------------------------------------------
'''
@description 
'''


def FullImage(passedImage, image):
    wholeImage = passedImage
    print("---------------------------------------------------")
    print("Collecting RGB values...")
    print("\n")
    RGBCollectionsFull(wholeImage, image)


# --------------------------------- ROI scan----------------------------------------------------------------------------
'''
@description 
'''


def RGBCollectionsROI(CroppedImage, image ):
    print("\n")
    print("Collecting RGB values...")
    print("\n")

    imageToSplit = CroppedImage
    averageRGB = CroppedImage
    imageHeight = imageToSplit.shape[0]
    imageWidth = imageToSplit.shape[1]

    averageRGB = cv2.cvtColor(averageRGB, cv2.COLOR_BGR2RGB)  # convert it to RGB channel
    r = averageRGB[:, :, 0]
    g = averageRGB[:, :, 1]
    b = averageRGB[:, :, 2]

    minimumBlueChannelValue = 0
    maximumBlueChannelValue = 0
    minimumGreenChannelValue = 0
    maximumGreenChannelValue = 0
    minimumRedChannelValue = 0
    maximumRedChannelValue = 0

    for y in range(imageHeight):
        for x in range(imageWidth):

            blueChannel = imageToSplit[ y, x, 0 ] # splits blue channel
            greenChannel = imageToSplit[ y, x, 1 ] # splits green channel
            redChannel = imageToSplit[ y , x , 2] # splits red channel

            #checks every value and replaces the value if it is higher than the currently saved in the variable
            if redChannel > maximumRedChannelValue :

                maximumRedChannelValue = redChannel

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


    averageR = np.average(r, axis=(0, 1))
    averageG = np.average(g, axis=(0, 1))
    averageB = np.average(b, axis=(0, 1))

    #***Remove with introduction of GUI***------------------------------------------------------------------------------
    RGBValuesTable = PrettyTable()

    # creates the rows and columns in the table
    RGBValuesTable.field_names = ["Channel:", "Highest", "Lowest", "Average"]
    RGBValuesTable.add_row(["Red:", maximumRedChannelValue, minimumRedChannelValue, averageR])
    RGBValuesTable.add_row(["Green:", maximumGreenChannelValue, minimumGreenChannelValue, averageG])
    RGBValuesTable.add_row(["Blue:", maximumBlueChannelValue, minimumBlueChannelValue, averageB])


    # Creates
    print("--------")
    print("HIGHS AND LOWS OF IMAGE")
    print(RGBValuesTable)
    print("\n")
    #***----------------------------------------------------------------------------------------------------------------

    thresholdROI(maximumRedChannelValue, maximumGreenChannelValue, maximumBlueChannelValue,
                 minimumRedChannelValue, minimumGreenChannelValue, minimumBlueChannelValue,
                 averageR, averageG, averageB, image)
# --------------------------------- full image scan---------------------------------------------------------------------
'''
@description 
'''


def RGBCollectionsFull(wholeImage, image):


    imageToSplit = wholeImage
    averageRGB = wholeImage
    imageHeight = imageToSplit.shape[0]
    imageWidth = imageToSplit.shape[1]

    averageRGB = cv2.cvtColor(averageRGB, cv2.COLOR_BGR2RGB)  # convert it to RGB channel
    r = averageRGB[:, :, 0]
    g = averageRGB[:, :, 1]
    b = averageRGB[:, :, 2]

    minimumBlueChannelValue = 0
    maximumBlueChannelValue = 0
    minimumGreenChannelValue = 0
    maximumGreenChannelValue = 0
    minimumRedChannelValue = 0
    maximumRedChannelValue = 0

    for y in range(imageHeight):
        for x in range(imageWidth):

            blueChannel = imageToSplit[y, x, 0]  # splits blue channel
            greenChannel = imageToSplit[y, x, 1]  # splits green channel
            redChannel = imageToSplit[y, x, 2]  # splits red channel

             # checks every value and replaces the value if it is higher than the currently saved in the variable
            if redChannel > maximumRedChannelValue:
                maximumRedChannelValue = redChannel

            if redChannel < minimumRedChannelValue:
                minimumRedChannelValue = redChannel

            if greenChannel > maximumGreenChannelValue:
                maximumGreenChannelValue = greenChannel

            if greenChannel < minimumGreenChannelValue:
                minimumGreenChannelValue = greenChannel

            if blueChannel > maximumBlueChannelValue:
                maximumBlueChannelValue = blueChannel

            if blueChannel < minimumBlueChannelValue:
                minimumBlueChannelValue = blueChannel

    averageR = np.average(r, axis=(0, 1))
    averageG = np.average(g, axis=(0, 1))
    averageB = np.average(b, axis=(0, 1))

    #***Remove with introduction of GUI*** ----------------------------------------------------------------------------
    RGBValuesTable = PrettyTable()

    # creates the rows and columns in the table
    RGBValuesTable.field_names = ["Channel:", "Highest", "Lowest", "Average"]
    RGBValuesTable.add_row(["Red:", maximumRedChannelValue, minimumRedChannelValue, averageR])
    RGBValuesTable.add_row(["Green:", maximumGreenChannelValue, minimumGreenChannelValue, averageG])
    RGBValuesTable.add_row(["Blue:", maximumBlueChannelValue, minimumBlueChannelValue, averageB])

    # Creates
    print("HIGHS AND LOWS OF IMAGE")
    print(RGBValuesTable)
    print("\n")
    #*** ---------------------------------------------------------------------------------------------------------------

    thresholdWHOLE(maximumRedChannelValue, maximumGreenChannelValue, maximumBlueChannelValue,
                 minimumRedChannelValue, minimumGreenChannelValue, minimumBlueChannelValue,
                 averageR, averageG, averageB, image)

# ---------------------------------Treshold ROI ----------------------------------------------------------------------
'''
@description 
'''
def thresholdROI(maximumRedChannelValue,maximumGreenChannelValue,maximumBlueChannelValue,
                 minimumRedChannelValue,minimumGreenChannelValue,minimumBlueChannelValue,
                 averageR, averageB, averageG, image):

    rAverageROI = 100.755
    gAverageROI = 85.4265
    bAverageROI = 73.3518

    rThresholdROI = 202.35
    gThresholdROI = 200.467
    bThresholdROI = 196.35

    rDifference = maximumRedChannelValue - minimumRedChannelValue
    gDifference = maximumGreenChannelValue - minimumGreenChannelValue
    bDifference = maximumBlueChannelValue - minimumBlueChannelValue

    # R Channel
    if rDifference < rThresholdROI:
       # print("R channel is fake")
        FakeR = False
    elif rDifference > rThresholdROI:
       # print("R channel is not fake")
        FakeR = True
    else:
        print("An Error has occured please re-run")

    # GChannel
    if gDifference < gThresholdROI:
        #print("G channel is fake")
        FakeG = False
    elif gDifference > gThresholdROI:
        #print("G channel is not fake")
        FakeG = True
    else:
        print("An Error has occured please re-run")

    # BChannel
    if bDifference < bThresholdROI:
        #("B channel is fake")
        FakeB = False
    elif bDifference > bThresholdROI:
        #print("B channel is not fake")
        FakeB = True
    else:
        print("An Error has occured please re-run")

    #average R channel

    if averageR < rAverageROI:
        #print("Average R channel is fake ")
        AverageFakeR = False

    elif averageR > rAverageROI:
        AverageFakeR= True
        #print("Average R is not fake")

    else:
        print("Error start again")

        # average G channel

    if averageG < gAverageROI:
        #print("Average R channel is fake ")
        AverageFakeG = False

    elif averageG > gAverageROI:
        AverageFakeG = True
        #print("Average G is not fake")

    else:
        print("Error start again")

        # average B channel

    if averageB < bAverageROI:
        #print("Average B channel is fake ")
        AverageFakeB = False

    elif averageB > bAverageROI:
        AverageFakeB = True
        #print("Average B is not fake")

    else:
        print("Error start again")



    RGBValuesTableResultsROI = PrettyTable()

    # creates the rows and columns in the table
    RGBValuesTableResultsROI.field_names = ["KEY", "Channel:", "Result:"]
    RGBValuesTableResultsROI.add_row(["False", "H/L RED Channel: ", FakeR])
    RGBValuesTableResultsROI.add_row([" = ", "H/L GREEN Channel:" ,FakeG ])
    RGBValuesTableResultsROI.add_row([" FAKE, ","H/L BLUE Channel: ", FakeB])
    RGBValuesTableResultsROI.add_row([" TRUE ", "AVERAGE RED Channel: ", AverageFakeR])
    RGBValuesTableResultsROI.add_row([" = ","AVERAGE GREEN Channel: ", AverageFakeG])
    RGBValuesTableResultsROI.add_row([" NOT FAKE ", "AVERAGE BLUE Channel: ", AverageFakeB])


    # Creates
    print("-------------------------------------------------")
    print("LEGITIMACY OF CHANNEL")
    print(RGBValuesTableResultsROI)
    print("\n")

    Calculations(FakeR, FakeG, FakeB, AverageFakeR, AverageFakeG, AverageFakeB, image)



# --------------------------------- End of program----------------------------------------------------------------------
'''
@description 
'''
def thresholdWHOLE(maximumRedChannelValue,maximumGreenChannelValue,maximumBlueChannelValue,
                   minimumRedChannelValue,minimumGreenChannelValue,minimumBlueChannelValue,
                   averageR, averageG, averageB, image):

    rThresholdWHOLE = 216.03
    gThresholdWHOLE = 216.458
    bThresholdWHOLE = 210.8333

    rAverageWHOLE = 114.80875
    gAverageWHOLE = 106.7195952
    bAverageWHOLE = 93.69226359

    FakeR = ''
    FakeG = ''
    FakeB = ''

    rDifference = maximumRedChannelValue - minimumRedChannelValue
    gDifference = maximumGreenChannelValue - minimumGreenChannelValue
    bDifference = maximumBlueChannelValue - minimumBlueChannelValue

    #print (rDifference, gDifference, bDifference)

    # R Channel
    if rDifference < rThresholdWHOLE:
        # print("R channel is fake")
        FakeR = False
    elif rDifference > rThresholdWHOLE:
        # print("R channel is not fake")
        FakeR = True
    else:
        print("An Error has occured please re-run")

    # GChannel
    if gDifference < gThresholdWHOLE:
        # print("G channel is fake")
        FakeG = False
    elif gDifference > gThresholdWHOLE:
        # print("G channel is not fake")
        FakeG = True
    else:
        print("An Error has occured please re-run")

    # BChannel
    if bDifference < bThresholdWHOLE:
        # ("B channel is fake")
        FakeB = False
    elif bDifference > bThresholdWHOLE:
        # print("B channel is not fake")
        FakeB = True
    else:
        print("An Error has occured please re-run")

    # average R channel

    if averageR < rAverageWHOLE:
        # print("Average R channel is fake ")
        AverageFakeR = False

    elif averageR > rAverageWHOLE:
        AverageFakeR = True
        # print("Average R is not fake")

    else:
        print("Error start again")

        # average G channel

    if averageG < gAverageWHOLE:
        # print("Average R channel is fake ")
        AverageFakeG = False

    elif averageG > gAverageWHOLE:
        AverageFakeG = True
        # print("Average G is not fake")

    else:
        print("Error start again")

        # average B channel

    if averageB < bAverageWHOLE:
        # print("Average B channel is fake ")
        AverageFakeB = False

    elif averageB > bAverageWHOLE:
        AverageFakeB = True
        # print("Average B is not fake")

    else:
        print("Error start again")

    Calculations(FakeR, FakeG, FakeB, AverageFakeR, AverageFakeG, AverageFakeB, image)

# --------------------------------- Calculations ----------------------------------------------------------------------
'''
@description 
'''
def Calculations(FakeR, FakeG, FakeB, AverageFakeR, AverageFakeG, AverageFakeB, image):

    rResult = ''
    gResult = ''
    bResult = ''

    rAverage = ''
    gAverage = ''
    bAverage = ''

    if FakeR == False:
        rResult = 16.6
    elif FakeR == True:
        rResult = 0
    else:
        print("An Error has occurred please re-run")

    if FakeG == False:
        gResult = 16.6
    elif FakeG == True:
        gResult = 0
    else:
      print("An Error has occured please re-run")

    if FakeB == False:
        bResult = 16.6
    elif FakeB == True:
        bResult = 0
    else:
        print("An Error has occured please re-run")

    #Averages

    if AverageFakeR == False:
        rAverage = 16.6
    elif AverageFakeR == True:
        rAverage = 0
    else:
        print("An Error has occured please re-run ")

    #GreenAverage

    if AverageFakeG == False:
        gAverage = 16.6
    elif AverageFakeG == True:
        gAverage = 0
    else:
        print("An Error has occured please re-run ")

    #BAverage

    if AverageFakeB == False:
        bAverage = 16.6
    elif AverageFakeB == True:
        bAverage = 0
    else:
        print("An Error has occured please re-run ")

    Results = rResult + gResult + bResult + rAverage + gAverage + bAverage

    outputs(Results, image)

# --------------------------------- results ----------------------------------------------------------------------
'''
@description 
'''

def outputs(Results, image):

    print("-------------------------------------------")
    print("Result of Image scan is: ")

    if Results == 0:
        print("Image is",Results,"% Fake, This is Image is not seamlessly cloned")
        time.sleep(1)
        CLEAN(image)
    elif Results == 16.6:
        print("Image is",Results,"% Fake, This is Image unlikly to be seamlessly cloned")
        time.sleep(1)
        CLEAN(image)
    elif Results == 33.3:
        print('Image is', Results , '% fake, REFER!: Manual intervention needed!')
        time.sleep(1)
        MANUALINTERVENTION(image)
    elif Results == 49.800000000000004:
        print('Image is', Results , '% fake, REFER!: Manual intervention needed!')
        time.sleep(1)
        MANUALINTERVENTION(image)
    elif Results == 66.4:
        print('Image is', Results , '% fake, REFER!: Manual intervention needed!')
        time.sleep(1)
        MANUALINTERVENTION(image)
    elif Results == 83:
        print('Image is',Results , '% fake, THIS IMAGE IS LIKELY TO BE FAKE')
        FAKEREFER(image)
    elif Results == 99.6:
        print('Image is',Results , '% fake, FAKE: DO NOT UPLOAD THIS IMAGE IS FAKE')
        FAKEREFER(image)
    else:
        print("Number not recognized")
    print("-------------------------------------------")

# --------------------------------- FAKE REFER ----------------------------------------------------------------------
'''
@description 
'''

def FAKEREFER(image):
    print("\n")
    print("-----------------------------------------")
    print("image is not clean")
    img_src = cv2.imwrite('C:\\Users\\James\\Desktop\\SeamlessCloning\\Referals\\FAKE\\FAKE.jpg', image)
    print( img_src, "has been added to the FAKE FOLDER")
    print("-----------------------------------------")
    endOfProgram()

# --------------------------------- End of program----------------------------------------------------------------------
'''
@description 
'''

def MANUALINTERVENTION(image):
    print("\n")
    print("-----------------------------------------")
    print("This Image needs to be manually intervened")
    print("-----------------------------------------")
    print("Would you like to view the image?")
    print("-----------------------------------------")
    viewImage = str(input("yes/no?: "))

    if viewImage == 'yes':

         cv2.imshow("Press enter once finished viewing", image)
         cv2.waitKey(0)
         cv2.destroyAllWindows()
         print("Please look at image and refer for manual intervention")
         print("1. REFER AS FAKE! ")
         print("2. REFER AS CLEAN ")
         print("3. CANCEL ")
         print("--------------------------------------")
         inputOption = int(input("Enter a number: "))

    elif viewImage == 'no':

        print("Please look at image and refer for manual intervention")
        print("1. REFER AS FAKE! ")
        print("2. REFER AS CLEAN ")
        print("3. CANCEL ")
        print("--------------------------------------")
        inputOption = int(input("Enter a number: "))
    else:
        print("There was a problem Restart")

    #
    if inputOption == 1:
        FAKEREFER(image)
    elif inputOption == 2:
        CLEAN(image)
    elif inputOption == 3:
        endOfProgram()
    else:
        print("error restart!")



# --------------------------------- End of program----------------------------------------------------------------------
'''
@description 
'''

def CLEAN(image):
    print("\n")
    print("-----------------------------------------")
    print("image is clean")
    cv2.imwrite('C:\\Users\\James\\Desktop\\SeamlessCloning\\Referals\\CLEAN\\FAKE.jpg', image)
    print("Image has been added to the CLEAN FOLDER")
    print("-----------------------------------------")


    endOfProgram()


'''
   path = 'C:\\Users\\James\\Desktop\\SeamlessCloning\\Referals\\CLEAN\\FAKE.jpg'

    for i in range(len(image)):
        img = cv2.imwrite(os.path.join(path,'Image_'+str(i)+'.tif'), )
        cv2.waitKey(0)

        print(img)
        print("\n")
        print("-----------------------------------------")
        print("image is clean")
        img_src = cv2.imwrite('C:\\Users\\James\\Desktop\\SeamlessCloning\\Referals\\CLEAN\\FAKE.jpg', image)
        print(img_src, "has been added to the CLEAN FOLDER")
        print("-----------------------------------------")
        endOfProgram()

'''




# --------------------------------- End of program----------------------------------------------------------------------
'''
@description 
'''

def userguide(image):
    print("User Guide")
    print("----------------------------------------------------")
    print("1. Input image path in code path Line *please insert line*")
    print("2. Run program and select what process is needed")
    print("3. Change destination routes (Paths) on lines *Insert lines* ")
    print()
    print("To return type 'back'or 'exit' to end")

    inputOption = str(input("Enter a number: "))

    if inputOption == 'back':
        chooseDetection(image)

    elif inputOption == exit:
        endOfProgram()

# --------------------------------- End of program----------------------------------------------------------------------
'''
@description 
'''


def endOfProgram():
    print("\n")
    print("Program Terminated")
    print("\n")
    exit()


# def output():
main()

