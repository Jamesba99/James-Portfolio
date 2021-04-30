import cv2

img = cv2.imread('C:\\Users\\James\\Desktop\\SeamlessCloning\\SCImages\\Sky+planeOutput.jpg')
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # Converts from BGR to RGB

rgb = cv2.resize(rgb, (240,380)) # re size the image
for x in range(0, 380, 1): # takes pixels from x up to entered amount
    for y in range(0, 240, 1): # takes pixels from x up to entered amount
        color = rgb[x, y]
        sorted(color, reverse=True) # sorts the list
        print("RGB values: " + str(color))

