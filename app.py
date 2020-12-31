
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request, render_template
import git
import hmac
import hashlib
import os
import requests
import praw
import spotipy
import spotipy.oauth2 as oauth2

github_signature = os.getenv("GIT_SECRET_KEY")
email_api_key = os.getenv("EMAIL_SECRET_KEY")
praw_client_id = os.getenv("PRAW_CLIENT_ID")
praw_secret_key = os.getenv("PRAW_SECRET_KEY")
spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
spotify_secret_key = os.getenv("SPOTIFY_SECRET_KEY")
nasa_secret_key = os.getenv("NASA_SECRET_KEY")

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


@app.route('/contact', methods=["GET","POST"])
def contact():
    #if request.method == "GET":
    #    return render_template('contact.html')
    if request.method == "POST":
        r = requests.post(
		"https://api.mailgun.net/v3/sandboxad9646f00f0240fd8e3a70f71f5c86ae.mailgun.org/messages",
		auth=("api", email_api_key),
		data={"from": "Mailgun Sandbox <postmaster@sandboxad9646f00f0240fd8e3a70f71f5c86ae.mailgun.org>",
			"to": "MICHAEL BOSTWICK <bostwicm@gmail.com>",
			"subject": request.form['emailSubject'],
			"text": 'Name: ' + request.form['submitterName'] + '\n\n' + 'Email: ' + request.form['submitterEmail'] + '\n\n' + request.form['emailBody']})
        r

    return render_template('contact.html')


@app.route('/portfolio/reddit_project', methods=["GET","POST"])
def reddit():
    if request.method == "POST":
        subreddit = request.json['data']
        redditInstance = praw.Reddit(client_id=praw_client_id, client_secret=praw_secret_key, user_agent="web:michaelbostwick.com/portfolio/reddit_project:v1.0.0 (by /u/zapatosgatos)")
        posts = {}

        for post in redditInstance.subreddit(subreddit).top("day", limit=10):
            posts[post.title] = post.permalink

        return posts

    return render_template('projects/reddit_project.html')


@app.route('/portfolio/spotify_project', methods=["GET","POST"])
def spotify():
    if request.method == "POST":
        artist = request.json['data']
        credentials = oauth2.SpotifyClientCredentials(
            client_id = spotify_client_id,
            client_secret = spotify_secret_key
        )
        token = credentials.get_access_token()
        full_discography = {}
        albums = []     #children
        individual_album = {}
        tracks = []
        individual_track = {}
        sp = spotipy.Spotify(auth=token)
        #albumInfo = sp.search(q='album:' + album, type='album', limit='1')
        #for x in albumInfo['albums']['items']:
        #    album_id = x['id']
        artistInfo = sp.search(q='artist:' + artist, type='artist', limit='1')
        for x in artistInfo['artists']['items']:
            artist_id = x['id']

        '''
        full_discography = {
            'name': artist, 'children': [{
                'name': album_title1,
                'children': [{'name': track1, 'size': 1}, {'name': track2, 'size': 1}]
            }, {
                'name': album_title2,
                'children': [{'name': track1, 'size': 1}, {'name': track2, 'size': 1}]
            }]
        }

        full_discography = {
            name=artist, albums[{individual_album1}, {individual_album2}]
        }
        '''

        full_discography['name'] = artist

        spAlbums = sp.artist_albums(artist_id, album_type='album')
        for album in spAlbums['items']:
            '''
            album_tracks = []
            tracks = sp.album_tracks(album['id'])
            for track in tracks['items']:
                album_tracks.append(track['name'])
            full_discography[album['name']] = album_tracks
            '''
            tracks = []
            individual_album = {}
            individual_album['name'] = album['name']
            spTracks = sp.album_tracks(album['id'])
            for track in spTracks['items']:
                individual_track = {}
                individual_track['name'] = track['name']
                individual_track['size'] = 1
                tracks.append(individual_track)

            individual_album['children'] = tracks

            albums.append(individual_album)

        full_discography['children'] = albums

        return full_discography

    return render_template('projects/spotify_project.html')


@app.route('/portfolio/mars_weather', methods=["GET","POST"])
def mars():
    individual_day = {}
    weather_report = {}
    r = requests.get(f'https://api.nasa.gov/insight_weather/?api_key={nasa_secret_key}&feedtype=json&ver=1.0')
    forcast = r.json()

    for day in forcast:
        #print(day)
        if day not in ['sol_keys', 'validity_checks']:
            individual_day = {}

            if 'AT' in forcast[day]:
                #Temp is stored as low, high, average
                individual_day['Temperature'] = [forcast[day]['AT']['mn'], forcast[day]['AT']['mx'], forcast[day]['AT']['av']]
            else:
                individual_day['Temperature'] = ['NaN', 'NaN', 'NaN']

            weather_report[day] = individual_day

    return render_template('projects/mars_weather.html', weather_report=weather_report)
