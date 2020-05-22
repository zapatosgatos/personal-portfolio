
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request, render_template
import git
import hmac
import hashlib
import os

github_signature = os.getenv("GIT_SECRET_KEY")

app = Flask(__name__, template_folder='/home/zapatosgatos/personal_portfolio/personal-portfolio/templates', static_folder='/home/zapatosgatos/personal_portfolio/personal-portfolio/static')

def is_valid_signature(x_hub_signature, data, private_key):
    # x_hub_signature and data are from the webhook payload
    # private key is your webhook secret
    hash_algorithm, github_signature = x_hub_signature.split('=', 1)
    algorithm = hashlib.__dict__.get(hash_algorithm)
    encoded_key = bytes(private_key, 'latin-1')
    mac = hmac.new(encoded_key, msg=data, digestmod=algorithm)
    return hmac.compare_digest(mac.hexdigest(), github_signature)

#Handles the github webhook
@app.route('/update_server', methods=['POST'])
def webhook():
    if request.method == 'POST':
        x_hub_signature = request.headers['X-Hub-Signature']
        if is_valid_signature(x_hub_signature, request.data, github_signature):
            repo = git.Repo('/home/zapatosgatos/personal_portfolio')
            origin = repo.remotes.origin
            origin.pull()
            return 'Updated PythonAnywhere successfully', 200
        else:
            return 'Not valid signature', 400
    else:
        return 'Wrong event type', 400


@app.route('/')
def about():
    return render_template('about.html')


@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')
