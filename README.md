# Install

# Run

docker build -t app-ui --build-arg UI_API_URL=http://localhost:8000 --build-arg UI_DB_URL=http://localhost:8001 --build-arg UI_APP_UI_URL=http://localhost:8080 .
docker run -d -p 8080:80 app-ui

# bitmatrix-app-ui

:sparkles: :star2:

[Try live demo](https://beta.bitmatrix.app)
