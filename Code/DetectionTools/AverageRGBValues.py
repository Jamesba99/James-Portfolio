from PIL import Image
from ipython_genutils.py3compat import xrange
path = ('C:\\Users\\James\\Desktop\\SeamlessCloning\\SCImages\\Mixed\\-NORMAL-OutputTicket+wood.jpg')
class AverageRGBCalculator(object):
  def __init__(self, imageName):
      self.pic = Image.open(imageName)
      # load image data
      self.imgData = self.pic.load()
  def averagePixels(self):
      r, g, b = 0, 0, 0
      count = 0
      for x in xrange(self.pic.size[0]):
          for y in xrange(self.pic.size[1]):
              tempr,tempg,tempb = self.imgData[x,y]
              r += tempr
              g += tempg
              b += tempb
              count += 1
      # calculate averages
      return (r/count), (g/count), (b/count)

if __name__ == '__main__':
  pc = AverageRGBCalculator(path)
  print("(red, green, blue)")
  print(pc.averagePixels())