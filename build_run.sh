cd ./wasm && \
GOOS=js GOARCH=wasm go build -o ../crowdsec-playground/public/main.wasm && \
cd ../crowdsec-playground/ && \
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./public/ && \
PUBLIC_URL=/ npm start
