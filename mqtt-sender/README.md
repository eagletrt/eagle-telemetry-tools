# Install

```bash
apt-get install can-utils
git clone https://github.com/lucagump/fenice-tools.git
cd fenice-tools
npm install 
```

# Run

## First Terminal

cansetup.sh accept two parameters vcan0 or can0

```bash
sudo tools/cansetup.sh
node sender.js
```
## Second Terminal

cantest.sh accept accepts different parameters, use paramenters **ONLY** in vcan0 mode

```bash
./tools/cantest.sh
```
## Third Terminal

```bash
mosquitto_sub -h localhost -t chimera
```

## Fourth Terminal

```bash
cansend vcan0 0FF#01010101
```
