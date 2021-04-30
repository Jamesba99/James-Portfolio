import sys
from PyQt5 import QtWidgets
from PyQt5.QtWidgets import QMainWindow, QLineEdit, QApplication
from PyQt5.QtGui import QPainter, QBrush, QPen, QFont
from PyQt5.QtCore import Qt
import random


class MyWindow(QMainWindow):  # creates a class

    def __init__(self):  # creates function that will run an instance of mywindow
        super(MyWindow, self).__init__()

        self.setGeometry(200, 200, 1250, 900)  # sets the size of the window
        self.setWindowTitle("GUI For Tool To Detect A Seamlessly Cloned Image")  # names the window
        self.initUI()

    def initUI(self):  # creates a instance of my window

        self.outputLabel = QtWidgets.QLabel(self)  # sets where the label will be
        self.outputLabel.setFont(QFont('Arial', 20))
        self.outputLabel.move(900, 650)  # shows where its going to go

        # label created for when input is clicked
        self.activateLabel = QtWidgets.QLabel(self)  # sets where the label will be
        self.activateLabel.setFont(QFont('Arial', 18))
        self.activateLabel.move(750, 600)  # shows where its going to go

        # label created for when activate is pressed
        self.ImageLabel = QtWidgets.QLabel(self)  # sets where the label will be
        self.ImageLabel.setFont(QFont('Arial', 18))
        self.ImageLabel.move(125, 400)  # shows where its going to go

        # Label for probability
        self.ProbabilityButton = QtWidgets.QLabel(self)  # sets where the label will be
        self.ProbabilityButton.setFont(QFont('Arial', 18))
        self.ProbabilityButton.move(660, 300)  # shows where its going to go

        # Button created for fake
        self.FakeButton = QtWidgets.QPushButton(self)
        self.FakeButton.setText("Refer as Fake")
        self.FakeButton.clicked.connect(self.clicked)  # calls the clicked function when button is clicked
        self.FakeButton.setGeometry(75, 700, 250, 100)

        # self. allows access to label and b1 anywhere in the class
        self.okayButton = QtWidgets.QPushButton(self)
        self.okayButton.setText("Refer as OK")
        self.okayButton.clicked.connect(self.clickedFake)  # calls the clicked function when button is clicked
        self.okayButton.setGeometry(300, 700, 250, 100)

        # Activate button
        self.activateButton = QtWidgets.QPushButton(self)
        self.activateButton.setText("Activate")
        self.activateButton.clicked.connect(self.clickedActivate)  # calls the clicked function when button is clicked
        self.activateButton.setGeometry(815, 150, 300, 50)

        # Probability button
        self.probabilityButton = QtWidgets.QPushButton(self)
        self.probabilityButton.setText("Generate Probability")
        self.probabilityButton.clicked.connect(
            self.clickedProbability)  # calls the clicked function when button is clicked
        self.probabilityButton.setGeometry(800, 390, 300, 50)

        # input box
        self.line = QLineEdit(self)
        self.line.move(760, 100)
        self.line.resize(400, 50)

    def paintEvent(self, e):  # Rectangle for GUI

        # Left pannel
        leftPannel = QPainter(self)
        leftPannel.setPen(QPen(Qt.black, 10, Qt.SolidLine))  # sets all variables tp create the "pen size"
        leftPannel.setBrush(QBrush(Qt.white, Qt.SolidPattern))
        leftPannel.drawRect(0, 0, 650, 900)

        # Placeholder pannel
        PlaceholderForImage = QPainter(self)
        PlaceholderForImage.setPen(QPen(Qt.black, 10, Qt.SolidLine))  # sets all variables tp create the "pen size"
        PlaceholderForImage.setBrush(QBrush(Qt.white, Qt.SolidPattern))
        PlaceholderForImage.drawRect(100, 50, 450, 600)

        # Right Pannel
        rightPannel = QPainter(self)
        rightPannel.setPen(QPen(Qt.black, 10, Qt.SolidLine))  # sets all variables tp create the "pen size"
        rightPannel.setBrush(QBrush(Qt.white, Qt.SolidPattern))
        rightPannel.drawRect(1250, 0, -600, 900)

        # Probability box
        probability = QPainter(self)
        probability.setPen(QPen(Qt.black, 10, Qt.SolidLine))  # sets all variables tp create the "pen size"
        probability.setBrush(QBrush(Qt.white, Qt.SolidPattern))
        probability.drawRect(650, 250, 600, 200)
        # when Fake button is clicked this function is called

    def clicked(win):
        win.ImageLabel.setText("Image is refered as Fake")
        win.update()
        # when OK button is clicked this function is called

    def clickedFake(win):
        win.ImageLabel.setText("Image is refered as OK")
        win.update()

        # when activate button is clicked this function is called

    def clickedActivate(win):
        Outputs = ['Fake!', 'Refer"', 'OK!']
        Resultoutput = random.choice(Outputs)
        win.activateLabel.setText("Reviewed image result:")
        win.outputLabel.setText(Resultoutput)
        # print(Resultoutput)
        win.update()

        # when probability button is clicked this function is called

    def clickedProbability(win):
        value = random.randint(1, 100)
        win.ProbabilityButton.setText("Probability of image being fake: " + str(value) + '%')
        win.update()

    def update(win):  # called to make the label automatically ajust to the size of the text
        win.ImageLabel.adjustSize()
        win.activateLabel.adjustSize()
        win.ProbabilityButton.adjustSize()


def GUI():  # creates a function

    app = QApplication(sys.argv)  # creates the defaults for the Q applciation
    win = MyWindow()  # creates the window
    win.show()  # creates a window to the size called above
    sys.exit(app.exec_())  #


GUI()  # Calls the function