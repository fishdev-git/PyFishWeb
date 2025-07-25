from flask import Flask, send_from_directory, render_template


class fish_server():
    def __init__(self):
        self.app = Flask(__name__)
        @self.app.route('/')
        def home():
            return render_template('homepage.html')

        @self.app.route('/resume')
        def display_resume():
            return render_template('resumepage.html')

        @self.app.route('/abyss')
        def game():
            return "spaghetti"

    def host(self):
        self.app.run(host='0.0.0.0', port=8080)