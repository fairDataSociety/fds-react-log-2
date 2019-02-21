import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FDS from 'fds';

// window.FDS = new FDS({
//       // domain: 'resolver.eth',
//       swarmGateway: 'http://localhost:8500', 
//       ethGateway: 'http://localhost:8545',
//       faucetAddress: 'http://localhost:3001/gimmie',
//       httpTimeout: 1000,
//       gasPrice: 50,
//       ensConfig: {
//         domain: 'resolver.eth',
//         registryAddress: '0x19595c15daf318ae20148b1f37b810203a018d89',
//         fifsRegistrarContractAddress: '0xae466734c6fa5c76b304216e6e00da3c5c2eea74',
//         resolverContractAddress: '0x9975163749349d0e33bf882aeb5e17960cfe2fd2'
//       }
//     });


window.FDS = new FDS({
      swarmGateway: 'http://209.97.190.111:8500', 
      ethGateway: 'http://209.97.190.111:8545',
      faucetAddress: 'https://dfaucet-testnet-dev.herokuapp.com/gimmie',
      httpTimeout: 1000,
      gasPrice: 50,
      ensConfig: {
        domain: 'datafund.eth',
        registryAddress: '0x246d204ae4897e603b8cb498370dcbb2888213d1',
        fifsRegistrarContractAddress: '0xbbcfe6ccee58d3ebc82dcd4d772b2484d23d0a0b',
        resolverContractAddress: '0x79164c357f81627042d958533bba8a766c81f3d6'
      }
    });


let simulateCreateTwoAndSendTwo = ()=>{

  let r1 = Math.floor(Math.random() * 1010101);
  let r2 = Math.floor(Math.random() * 1010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    console.log(`registered account 1 ${account1.subdomain}`);  
  }).then(() => {
    return window.FDS.CreateAccount(`test${r2}`, 'test', console.log).then((account) => {
      account2 = account;
      console.log(`registered account 2 ${account2.subdomain}`);  
    }).catch(console.error)
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      let r = Math.floor(Math.random() * 10101);
      let file = new File([`hello world ${r}`], `test${r}.txt`, {type: 'text/plain'});
      return acc1.send(account2.subdomain, file, console.log, console.log, console.log).then((message)=>{
        console.log(`>>>> successfully sent ${message} to ${account2.subdomain}`);
      });
    })
  }).then(()=>{
    console.log(`window.FDS.UnlockAccount('${account2.subdomain}', 'test').then((acc2)=>{
      acc2.messages().then((messages)=>{
        console.log('m', messages.length)
        messages[0].getFile().then(console.log)
        messages[0].saveAs();
      })
    })`)
    console.log(`window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
      acc2.messages('sent').then((messages)=>{
        console.log('m', messages.length)
        messages[0].getFile().then(console.log)
        messages[0].saveAs();
      })
    })`)
    //todo check from sent mailbox too
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      let r = Math.floor(Math.random() * 10101);
      let file = new File([`hello world 2${r}`], `test${r}-snd.txt`, {type: 'text/plain'});
      acc1.send(account2.subdomain, file, console.log, console.log, console.log).then((message)=>{
        console.log(`>>>> successfully sent ${message} to ${account2.subdomain}`);
      });
    })
  });

}

let createAndStore = ()=>{

  let r1 = Math.floor(Math.random() * 10101);
  let r2 = Math.floor(Math.random() * 10101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    console.log(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      let r = Math.floor(Math.random() * 10101);
      let file = new File(['hello storage world'], `test${r}.txt`, {type: 'text/plain'});
      acc1.store(file, console.log, console.log, console.log).then((stored)=>{
        console.log(`>>>> successfully stored ${stored} for ${acc1.subdomain}`);
      });
    })
  }).then(()=>{
    console.log(`window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
      acc2.stored().then((stored)=>{
        console.log('m', stored.length)
        stored[0].getFile().then(console.log)
        stored[0].saveAs();
      })
    })`)
  });

}

let createAndBackup = ()=>{

  let r1 = Math.floor(Math.random() * 10101);
  let r2 = Math.floor(Math.random() * 10101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    console.log(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.BackupAccount(account1.subdomain, 'test');
  });

}

let backupJSON = null;

let createDeleteAndRestore = ()=>{

  let r1 = Math.floor(Math.random() * 10101);
  let r2 = Math.floor(Math.random() * 10101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    console.log(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    let accounts = window.FDS.GetAccounts();
    let f = accounts.filter((a)=>{return a.subdomain === account1.subdomain});
    if(f.length === 1){
      console.log(`success: account ${account1.subdomain} exists`);
      backupJSON = JSON.stringify(accounts[0].wallet);
    }else{
      throw new Error(`account ${account1.subdomain} does not exist`)
    }
    return window.FDS.DeleteAccount(account1.subdomain);
  }).then(()=>{
    let accounts = window.FDS.GetAccounts();
    let f = accounts.filter((a)=>{return a.subdomain === account1.subdomain});
    if(f.length === 0){
      console.log(`success: account ${account1.subdomain} does not exist`)
    }else{
      throw new Error(`account ${account1.subdomain} exists`)
    }
  }).then(()=>{
    let backupFile = new File([backupJSON], `fairdrop-wallet-${account1.subdomain}-backup (1).json`, {type: 'text/plain'});
    window.FDS.RestoreAccount(backupFile).then(()=>{
      let accounts = window.FDS.GetAccounts();
      let f = accounts.filter((a)=>{return a.subdomain === account1.subdomain});
      if(f.length === 1){
        console.log(`success: account ${account1.subdomain} exists`)
      }else{
        throw new Error(`account ${account1.subdomain} does not exist`)
      }    
    });
    //todo check you can send to/from and store
  }).catch(console.error);

}



let createAndStoreValue = ()=>{
  let r1 = Math.floor(Math.random() * 10101);
  let r2 = Math.floor(Math.random() * 10101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    console.log(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      acc1.storeValue('k1', 'hello value world').then((stored)=>{
        console.log(`>>>> successfully stored ${stored} for ${acc1.subdomain}`);
      });
    })
  }).then(()=>{
    console.log(`window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
      acc2.retrieveValue('k1').then(console.log)
    })`)
  });
}

let createAndStoreEncryptedValue = ()=>{
  let r1 = Math.floor(Math.random() * 10101);
  let r2 = Math.floor(Math.random() * 10101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    console.log(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      acc1.storeEncryptedValue('k1', 'hello encrypted value world').then((stored)=>{
        console.log(`>>>> successfully stored ${stored} for ${acc1.subdomain}`);
      });
    })
  }).then(()=>{
    console.log(`window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
      acc2.retrieveDecryptedValue('k1').then(console.log)
    })`)
  });
}

simulateCreateTwoAndSendTwo();
// createAndStore();
// createAndStoreValue();
// createAndStoreEncryptedValue();
// createAndBackup();
// createDeleteAndRestore();



// window.FDS.UnlockAccount('test7045', 'test').then((acc2)=>{
//       acc2.messages().then((messages)=>{
//         console.log('m', messages.length)
//         messages[0].getFile().then(console.log)
//         messages[0].saveAs();
//       })
//     })


let r1 = Math.floor(Math.random() * 10101);

// window.FDS.CreateAccount(`test${r1}`, 'test', console.log)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
