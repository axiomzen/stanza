import requests
import re
from bs4 import BeautifulSoup
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

BASE_URL = 'http://www.poetryarchive.org/'
BASE_POEM_URL = BASE_URL + 'poem/'
BASE_EXPLORE_PAGE = BASE_URL + 'explore/browse-poems?page=%d&f[0]=type:poem'

client = MongoClient('localhost', 27017)
db = client.stanza
poems = db.poems

def save_poem(slug):

	try:
		html = requests.get(BASE_POEM_URL + slug).text
	except requests.exceptions.TooManyRedirects:
		return

	soup = BeautifulSoup(html, 'html.parser')

	poem_page = soup.find(class_="poem-page")

	title = poem_page.find('h4').text
	poet = poem_page.find('p', class_='sub').text
	audio = poem_page.find('source')['src']

	stanzas = soup.find(class_='poem-body').find_all('p')

	themes = soup.find_all(class_='view-poem-content-relations')[2].find_all('a')

	content_relations = soup.find_all(class_='view-poem-content-relations')

	themes = []

	for content_relation in content_relations:
		header = content_relation.find('strong')
		if header and header.text == 'Themes':
			for theme in content_relation.find_all('a'):
				themes.append(theme.text)

	body = '\n'.join([re.sub('[\t+]', '', stanza.text) + '\n' for stanza in stanzas]).encode('utf-8')

	poem = {
		'_id': slug,
		'title': title,
		'poet': poet,
		'audio': audio,
		'themes': themes,
		'body': body
	}

	try:
		print poems.insert_one(poem).inserted_id
	except DuplicateKeyError:
		pass

def scrape_page(number):
	html = requests.get(BASE_EXPLORE_PAGE % number).text
	soup = BeautifulSoup(html, 'html.parser')

	poems = soup.find_all(class_='views-row')

	if len(poems) == 1:
		raise Exception()

	for poem in poems:
		content = poem.find(class_='content')
		if content:
			slug = content.find('a')['href'].split('/')[-1]
			save_poem(slug)

def scrape_archive(start, end):
	for n in range(start, end):
		try:
			scrape_page(n)
		except Exception as e:
			pass

def print_poems():
	for poem in poems.find():
		print poem

scrape_archive(70, 200)
#print_poems()