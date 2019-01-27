# Blockchain-based-Certificate-issue-and-validation

## Installation

### Nodejs

Install nodejs using the apt package manager

```sh
$ sudo apt install nodejs
```

Verify with

```sh
$ nodejs --version
```

### npm

 Install npm using the apt package manager

```sh
$ sudo apt install npm
```

Verify with

```sh
$ npm --version
```

### Geth( go ethereum)

Geth is a multipurpose command line tool that runs a full Ethereum node implemented in Go

Installation using apt package manager
```sh
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install ethereum
```
  Verify 
 ```sh
 $ geth version
 ```
 
 ## Ganache-cli
 A command line version of ganache
 Ganache CLI uses ethereumjs to simulate full client behavior
 (Note: TectRPC is changed as ganache under truffle)
 
 Install using npm package manager
 ```sh
$  npm install -g ganache-cli
 ```
 Verify
 ```sh
 $ ganache-cli
```
It start running and display certain address
