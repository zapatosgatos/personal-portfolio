
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request
import git

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Newer extra fancy updates'

@app.route('/update_server', methods=['POST'])
def webhook():
    if request.method == 'POST':
        repo = git.Repo('/home/zapatosgatos/personal_portfolio')
        origin = repo.remotes.origin
        origin.pull()
        return 'Updated PythonAnywhere successfully', 200
    else:
        return 'Wrong event type', 400
