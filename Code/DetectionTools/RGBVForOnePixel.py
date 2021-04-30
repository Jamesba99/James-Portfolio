from PIL import Image

im = Image.open('C:\\Users\\James\\Desktop\\SeamlessCloning\\SCImages\\Sky+planeOutput.jpg')
rgb_im = im.convert('RGB')
r, g, b = rgb_im.getpixel((700, 100))
#changes where the image will be checking the RGB

print('Red: ' + str(r))
print('Green: ' + str(g))
print('Blue: ' + str(b))