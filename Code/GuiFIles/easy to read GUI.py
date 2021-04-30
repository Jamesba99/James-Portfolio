# -*- coding: utf-8 -*-
"""
Created on Mon Apr 12 12:44:18 2021

@author: James

https://www.youtube.com/watch?v=NrijKenny3Y

object modules
boundry box
smarten it up - light grey/blue 
thinner lines
bigger text in buttons

"""
import sys
from PyQt5.QtWidgets import QApplication, QWidget
import PyQt5.QtWidgets as QtWidgets
from PyQt5 import QtWidgets
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
from PyQt5.QtCore import Qt
import random
from PyQt5 import QtCore, QtGui, QtWidgets, uic
from PyQt5.QtCore import Qt



def main():
    GUI()



def GUI():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    
    qp = QPalette()
    qp.setColor(QPalette.Window, QColor(191, 215, 234))
    app.setPalette(qp)
    
    window = QWidget()#makes a new GUI
    window.setGeometry(200, 200, 1250, 900) # sets the size of the window
    window.setWindowTitle("GUI For Tool To Detect A Seamlessly Cloned Image")
    createGUIComponents(window, app)
    
    
    
def createGUIComponents(window, app):
    
    
    #fake button
    FakeButton = QPushButton(window)
    FakeButton.setText("Refer as Fake")
    FakeButton.setStyleSheet("background-color: #508CA4; color: #BFD7EA ")
    FakeButton.setFont(QFont('Arial', 11)) 
    #FakeButton.clicked.connect(window) # calls the clicked function when button is clicked
    FakeButton.setGeometry(75,700,250,100)  

    okayButton = QPushButton(window)
    okayButton.setText("Refer as OK")
    okayButton.setStyleSheet("background-color: #508CA4; color: #BFD7EA ")
    okayButton.setFont(QFont('Arial', 11))
    #okayButton.clicked.connect(self.clickedFake) # calls the clicked function when button is clicked
    okayButton.setGeometry(300,700,250,100)
        
    #Activate button 
    activateButton = QtWidgets.QPushButton(window)
    activateButton.setText("Activate")
    activateButton.setFont(QFont('Arial', 11)) 
    activateButton.setStyleSheet("background-color: #508CA4; color: #BFD7EA")
    #activateButton.clicked.connect(self.clickedActivate) # calls the clicked function when button is clicked
    activateButton.setGeometry(815,150,300,50)
   
    #Probability button
    probabilityButton = QtWidgets.QPushButton(window)
    probabilityButton.setText("Generate Probability")
    probabilityButton.setStyleSheet("background-color: #508CA4; color: #BFD7EA ")
    probabilityButton.setFont(QFont('Arial', 11)) 
    #probabilityButton.clicked.connect(window.clickedProbability) # calls the clicked function when button is clicked
    probabilityButton.setGeometry(800,390,300,50)
    #input box
    line = QLineEdit(window)
    line.move(760, 100)
    line.resize(400, 50)
    
    painter = QPainter(window)
    painter.setPen(Qt.red)
    
    painter.drawLine(10,10,100,140)
    
    painter.setPen(Qt.blue)
    painter.drawRect(120,10,80,80)

    

    leftPannel = QPainter(window)
    leftPannel.setPen(QColor(46,134,171))
    leftPannel.setBrush(QColor(191, 215, 234))
    leftPannel.drawRect(0,0,650,900)
    


    launchGUI(window, app)
   
   
def launchGUI(window, app):
    window.show() # shows the gui
    sys.exit(app.exec_()) # ends the programe  
main()



'''

if i want to do a pop up dialog?
def dialog():
    mbox = QMessageBox()

    mbox.setText("Your allegiance has been noted")
    mbox.setDetailedText("You are now a disciple and subject of the all-knowing Guru")
    mbox.setStandardButtons(QMessageBox.Ok | QMessageBox.Cancel)
    mbox.exec_()      
'''

'''
from PyQt5.QtWidgets import QApplication, QWidget
if __name__ == "__main__":
    app = QApplication(sys.argv)
    w = QWidget()
    w.resize(300,300)
    w.setWindowTitle("Guru99")
    w.show()
    sys.exit(app.exec_())
    '''