import cv2

# Reads in the image using CV2
img = cv2.imread('C:\\Users\\James\\Desktop\\SeamlessCloning\\SCImages\\Normal\\-NORMAL-OutputTicket+wood.jpg')
h = img.shape[0]
w = img.shape[1]

# sets the default values to 0
min_b = 0
max_b = 0
min_g = 0
max_g = 0
min_r = 0
max_r = 0

for y in range(h):  # by row
    for x in range(w):  # by column
        b = img[y, x, 0]  # return blue channel
        g = img[y, x, 1]  # return green channel
        r = img[y, x, 2]  # return red channel

        # checks every value and replaces the higest pixel if value is higher
        if r > max_r:
            max_r = r
        if r < min_r:
            min_r = r
        if g > max_g:
            max_g = g
        if g < min_g:
            min_g = g
        if b > max_b:
            max_b = b
        if b < min_b:
            min_b = b

# Prints the values
print("Min Red channel :", min_r)
print("Max Red channel : ", max_r)
print("Min Green channel ", min_g)
print("Max Green channel :", max_g)
print("Min Blue channel :", min_b)
print("Max Blue channel :", max_b)
