var encert;
var CertificateHash;
var encertmultihash;
var IpfsCert;


function viewCertificate(){
        IpfsCert = httpGet( "http://127.0.0.1:8080/ipfs/" + document.getElementById("encrypted_cert_hash").value);
        decrypt();
    }


function httpGet(theUrl)
    {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

function decrypt(){
        try {

            var privateKey = forge.pki.privateKeyFromPem(document.getElementById("privateKeyRecepient").value);
            var ctBytes = forge.util.decode64( IpfsCert);
            
            var plaintextBytes = privateKey.decrypt(ctBytes);
            // rsaMessage.val(plaintextBytes.toString('utf8')); <-- old
            console.log(forge.util.decodeUtf8(plaintextBytes));
             document.getElementById("certificate_display").innerHTML =  forge.util.decodeUtf8(plaintextBytes);

           // document.getElementById("download").href = 'data:attachment/text,' + forge.util.decodeUtf8(plaintextBytes);
           // document.getElementById("download").download = "certificate.json";

        }
        catch (e) {
            console.log(e);
            alert("cannot decrypt");
        }
    }


//Display content when load a file in Issuer Module
function upload(input) {
        
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                //var obj = JSON.parse( reader.result);
                //document.getElementById("nameRecipient").innerHTML = "here"
                //document.getElementById("providedDate").innerHTML = obj.receiver.name;
                document.getElementById("file_label").innerHTML = "selected";
                console.log( reader.result);
            };

            reader.readAsText(input.files[0]);

        }

    }

//Display content when load a file in Verifier Module
function upload1(input) {
        
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                //var obj = JSON.parse( reader.result);
                document.getElementById("upload_certificate").innerHTML = reader.result;
                //document.getElementById("providedDate").innerHTML = obj.receiver.name;
                //document.getElementById("details").display = "block";
                console.log( reader.result);
            };

            reader.readAsText(input.files[0]);

        }

    }

//Encrypt file with publickey
function encryptFile(){
        try {

            const reader = new FileReader();

            reader.onload = function() {
                var publicKey = forge.pki.publicKeyFromPem( document.getElementById("publicKeyRecepient").value);
                // var plaintextBuffer = forge.util.createBuffer(rsaMessage.val(), 'utf8'); <-- old
                var plaintextBytes = forge.util.encodeUtf8( reader.result);
        
                var encryptedBytes = publicKey.encrypt(plaintextBytes);
                console.log(forge.util.encode64(encryptedBytes));
                encert = forge.util.encode64(encryptedBytes);
                //document.getElementById("encert").value = reader.result;
            };
            const photo = document.getElementById("file-input");
            reader.readAsText(photo.files[0]); // Read Provided File
        }
        catch (e) {
            console.log(e);
            alert("cannot encrypt");
        }
    }

//File hashing with SHA256 for issuer
    function fileHashing() {
        const reader = new FileReader();
        //function executed when reader finish loading file
        let debased, decoded;
        reader.onload = function() {

            var md = forge.md.sha256.create();
            md.update(reader.result);
            console.log("Certificate Hash: " + md.digest().toHex());
            CertificateHash = String(md.digest().toHex());
        };
        const photo = document.getElementById("file-input");
        reader.readAsText(photo.files[0]); // Read Provided File
    }
//File hashing with with SHA256 for verifier
    function certHashing() {
        const reader = new FileReader();
        //function executed when reader finish loading file
        let debased, decoded;
        reader.onload = function() {

            var md = forge.md.sha256.create();
            md.update(reader.result);
            console.log("cert Hash: " + md.digest().toHex());
            document.getElementById("certificate_hash_verify").innerHTML=md.digest().toHex();
            CertificateHash = String(md.digest().toHex());

        };
        const photo = document.getElementById("file-input");
        reader.readAsText(photo.files[0]); // Read Provided File
    }

//Upload file to IPFS
 function uploadToIpfs() {
         fileHashing();
        const ipfs = window.IpfsApi('localhost', 5001); // Connect to IPFS
        //console.log( document.getElementById("encert").value);
        const buf = buffer.Buffer( encert); // Convert data into buffer
        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
          if(err) {
            console.error(err);
            return
          }
          let url = `https://ipfs.io/ipfs/${result[0].hash}`;
          let url1 = `http://127.0.0.1:8080/ipfs/${result[0].hash}`;
          console.log(`Url --> ${url}`);
          console.log(`Url --> ${url1}`);
          encertmultihash = `${result[0].hash}`;
          //document.getElementById("url").innerHTML= url;
          //document.getElementById("url").href= url;
          //document.getElementById("output").src = url;
        })
      }


console.log("Modules");



web3 = new Web3( new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var abi = [{"anonymous": false,"inputs": [{"indexed": false,"name": "certHash","type": "string"},{"indexed": false,"name": "owner","type": "address"},{"indexed": false,"name": "provider","type": "address"}],"name": "cerfificateCreated","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"name": "stat","type": "string"}],"name": "certificateRevoked","type": "event"},{"constant": false,"inputs": [{"name": "_hash","type": "string"},{"name": "_owner","type": "address"},{"name": "_enryptedHash","type": "string"}],"name": "createCertificate","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_hash","type": "string"}],"name": "revokeCertificate","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "_hash","type": "string"}],"name": "getCertificateDetails","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "getOwnerCertificates","outputs": [{"name": "","type": "string[]"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "getProviderCertificates","outputs": [{"name": "","type": "string[]"}],"payable": false,"stateMutability": "view","type": "function"}];
var ContractAddress = "0x375facd301f4e8063b69a1226c2066a823a4d827";

	async function init(){
          BlockVerifier = await new web3.eth.Contract(abi, ContractAddress);
          var accounts = await web3.eth.getAccounts();
          web3.eth.defaultAccount = accounts[3];
        }

        init();
      
      async function registerCertificate(){
        let issuer = document.getElementById("issuer_address").value;
        let owner = document.getElementById("receipent_address").value;
        console.log( " Certificate " + CertificateHash);
        console.log( "Owner " + owner);
        BlockVerifier.methods.createCertificate( CertificateHash, owner, encertmultihash).send({from: issuer, gas: 3000000}).on('receipt', function(receipt){
          document.getElementById('emit').innerHTML = "sucess";

        }).on('error', function(error){
          document.getElementById('emit').innerHTML = error;
        });
      }

      async function checkCertificate(){
        
        BlockVerifier.methods.getCertificateDetails( CertificateHash).call().then( function(result){
          console.log( result);
          if( result == "active")
            document.getElementById("certStatus").innerHTML = result;
          else
            document.getElementById("certStatus").innerHTML = "Not Active";
        });
      }

      async function getOwnerCertificate(){
        let ownerAddress = document.getElementById("owner_address").value;

        BlockVerifier.methods.getOwnerCertificates().call( { from: ownerAddress}).then( function(result){
          console.log( result);
          document.getElementById("ownerCerts").innerHTML = result;
        });
      }

      async function getProviderCertificate(){
        var providerAddress = document.getElementById("providerAddress").value;
        BlockVerifier.methods.getProviderCertificates().call( { from: providerAddress}).then( function(result){
          console.log( result);
          document.getElementById("providerStatus").innerHTML = result;
        });
      }

       async function revokeCertificate(){
        let providerAddress = document.getElementById("provAddress").value;
        let certHash = document.getElementById("certHash").value;
        BlockVerifier.methods.revokeCertificate( certHash).send({from: providerAddress}).on('receipt', function(receipt){
          document.getElementById('cStatus').innerHTML = receipt.events.certificateRevoked.returnValues.stat;
        }).on('error', function(error){
          document.getElementById('cStatus').innerHTML = error;
        });
      }