// Copyright 2019 The FairDataSociety Authors
// This file is part of the FairDataSociety library.
//
// The FairDataSociety library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The FairDataSociety library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the FairDataSociety library. If not, see <http://www.gnu.org/licenses/>.


let Web3Utils = require('web3-utils');
let EthCrypto = require('eth-crypto');

let ConsentContract = require('../contracts/Consent.json');

class Consent {

    constructor(FDSAccount, contractAddress, swarmHash) {
        this.account = FDSAccount;
        this.contractAddress = contractAddress;
        this.swarmHash = swarmHash;
        this.con = FDSAccount.getContract(ConsentContract.abi, ConsentContract.bytecode, contractAddress);
    }

    sign(){
      let h = this.swarmHash;

      const sigg = EthCrypto.sign(
          this.account.privateKey,
          h
      );

      var sig = sigg.slice(2);
      var v = Web3Utils.toDecimal(sig.slice(128, 130));
      var r = `0x${sig.slice(0, 64)}`;
      var s = `0x${sig.slice(64, 128)}`;

      return {
        h: h, 
        v: v, 
        r: r, 
        s: s
      }     
    }

    dataUser(){
      return this.con.call('dataUser', []);
    }

    signUser(){
      let sig = this.sign();      
      return this.con.send('signUser',[sig.h, sig.v, sig.r, sig.s]);
    }

    dataSubject(){
      return this.con.call('dataSubject', []);
    }

    signSubject(){
      let sig = this.sign();
      return this.con.send('signSubject',[sig.h, sig.v, sig.r, sig.s]);
    }  

    isUserSigned(){
      return this.con.call('isUserSigned', []);
    }

    isSubjectSigned(){
      return this.con.call('isSubjectSigned', []);
    }

    isSigned(){
      return this.con.call('isSigned', []);
    }

    isValid(){
      return this.con.call('isValid', []);
    }

    revokeConsent(){
      return this.con.send('revokeConsent', []);
    }

}

export default Consent