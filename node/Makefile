.PHONY: test

test:
	TEST_TOKEN=test NODE_ENV=test API_TOKEN=LocalApiToken HASH_SECRET=LocalHashSecret PORT=5000 MONGO_URI=mongodb://127.0.0.1/node DOMAIN=localhost:5000 ./node_modules/mocha/bin/mocha
