pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Certificate{
    struct certificateDetails{
        string status;
        address owner;
        address provider;
    }
    struct owners{
        string[] ownerHashes;
    }
    struct providres{
        string[] providerHashes;
    }
    mapping ( string => certificateDetails) certificate;
    mapping ( address => owners) ownerCertificates;
    mapping ( address => providres) providerCertificates;
    event cerfificateCreated( string certHash, address owner, address provider);
    event certificateRevoked( string stat);
    
    
    function createCertificate( string memory _hash, address _owner, string memory _enryptedHash) public{
        certificate[_hash].status = "active";
        certificate[_hash].owner = _owner;
        certificate[_hash].provider = msg.sender;
        ownerCertificates[_owner].ownerHashes.push(_enryptedHash);
        providerCertificates[msg.sender].providerHashes.push(_hash);
        emit cerfificateCreated( _hash, _owner, msg.sender);
    }
    
    function getOwnerCertificates() public view returns( string[] memory){
        return ownerCertificates[msg.sender].ownerHashes;
    }
    
    function getProviderCertificates() public view returns( string[] memory){
        return providerCertificates[msg.sender].providerHashes;
    }
    
    modifier onlyProvider( string memory _hash){
        require( certificate[_hash].provider == msg.sender, "access denied");
        _;
    }

    function revokeCertificate( string memory _hash) onlyProvider( _hash) public{
        certificate[_hash].status = "revoked";
        emit certificateRevoked( "revoke Sucess");
    }
    function getCertificateDetails( string memory _hash) public view returns( string memory){
        return certificate[_hash].status;
    }
    
}
