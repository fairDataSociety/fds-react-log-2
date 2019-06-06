import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FDS from 'fds.js';

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

window.FDS = new FDS(
{
  applicationDomain : "/shared/fairdrop/",
  swarmGateway: 'https://swarm.fairdatasociety.org', 
  ethGateway: 'https://geth-noordung.fairdatasociety.org',
  faucetAddress: 'https://dfaucet-testnet-prod.herokuapp.com/gimmie',
  httpTimeout: 1000,
  gasPrice: 0.1, //gwei    
  ensConfig: {
    domain: 'datafund.eth',
    registryAddress: '0xc11f4427a0261e5ca508c982e747851e29c48e83',
    fifsRegistrarContractAddress: '0x01591702cb0c1d03b15355b2fab5e6483b6db9a7',
    resolverContractAddress: '0xf70816e998819443d5506f129ef1fa9f9c6ff5a7'
  }
}
);

let simulateCreateTwoAndSendEncrypted = (setOutput, setResults)=>{

  let r1 = Math.floor(Math.random() * 101010101);
  let r2 = Math.floor(Math.random() * 101010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', setOutput).then(async (account) => {
    account1 = account;
    var multiboxData = await account.Mail.Multibox.traverseMultibox(account, account.subdomain);
    let applicationNodeExists = await account.Mail.Multibox.createPath(account, '/shared/fairdrop', multiboxData.id);

    console.log(`registered account 1 ${account1.subdomain}`);  
  }).then(() => {
    return window.FDS.CreateAccount(`test${r2}`, 'test', setOutput).then((account) => {
      account2 = account;
      console.log(`registered account 2 ${account2.subdomain}`);  
    }).catch(console.error)
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      let r = Math.floor(Math.random() * 1010101);
      let file = new File([`hello world ${r}`], `test${r}.txt`, {type: 'text/plain'});
      acc1.setApplicationDomain('/shared/fairdrop');
      return acc1.send(account2.subdomain, file, '/shared/fairdrop', setOutput, setOutput, setOutput).then((message)=>{
        console.log(`>>>> successfully sent ${message} to ${account2.subdomain}`);
      });
    })
  }).then(()=>{
    setResults(`simulateCreateTwoAndSendEncrypted went well, try...
    `);
    setResults(`window.FDS.UnlockAccount('${account2.subdomain}', 'test').then((acc2)=>{
  acc2.messages('received','/shared/fairdrop').then((messages)=>{
    console.log('m', messages.length)
    messages[0].getFile().then(console.log)
    messages[0].saveAs();
  })
})
    `)
    setResults(`window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
  acc2.messages('sent','/shared/fairdrop').then((messages)=>{
    console.log('m', messages.length)
    messages[0].getFile().then(console.log)
    messages[0].saveAs();
  })
})
    `)
    //todo check from sent mailbox too
  })
  // .then(()=>{
  //   return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
  //     let r = Math.floor(Math.random() * 1010101);
  //     let file = new File([`hello world 2${r}`], `test${r}-snd.txt`, {type: 'text/plain'});
  //     acc1.send(account2.subdomain, file, setOutput, setOutput, setOutput).then((message)=>{
  //       console.log(`>>>> successfully sent ${message} to ${account2.subdomain}`);
  //     });
  //   })
  // });

}



let simulateCreateTwoSubdomainsAndSendUnencrypted = (setOutput, setResults)=>{

  let r1 = Math.floor(Math.random() * 101010101);
  let r2 = Math.floor(Math.random() * 101010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', setOutput).then((account) => {
    account1 = account;
    console.log(`registered account 1 ${account1.subdomain}`);  
  })
  .then(() => {
    return window.FDS.CreateAccount(`test${r2}`, 'test', setOutput).then((account) => {
      account2 = account;
      console.log(`registered account 2 ${account2.subdomain}`);  
    }).catch(console.error)
  }).then(()=>{
    return window.FDS.UnlockAccount(account2.subdomain, 'test').then((acc2)=>{
      let r = Math.floor(Math.random() * 1010101);
      let file = new File([`hello world ${r}`], `test${r}.txt`, {type: 'text/plain'});
      return acc2.sendUnencrypted(account1.subdomain, file, setOutput, setOutput, setOutput).then((message)=>{
        console.log(`>>>> successfully sent ${message} to ${account1.subdomain}`);
      });
    })
  })
.then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      let r = Math.floor(Math.random() * 1010101);
      let file = new File([`hello world 2${r}`], `test${r}-snd.txt`, {type: 'text/plain'});
      acc1.sendUnencrypted(account2.subdomain, file, setOutput, setOutput, setOutput).then((message)=>{
        console.log(`>>>> successfully sent ${message} to ${account2.subdomain}`);
      });
    })
  }).then(()=>{
    setResults(`simulateCreateTwoAndSendUnencrypted went well, try...
    `);

    setResults(`window.FDS.UnlockAccount('${account2.subdomain}', 'test').then((acc2)=>{
  acc2.messages('sentUnencrypted').then((messages)=>{
    console.log('m', messages.length)
    // messages[0].getUnencryptedFile().then(console.log)
    // messages[0].saveAs();
  })
})
    `)

    setResults(`window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
  acc2.messages('sentUnencrypted').then((messages)=>{
    console.log('m', messages.length)
    // messages[0].getUnencryptedFile().then(console.log)
    // messages[0].saveAs();
  })
})
    `)

    setResults(`
window.FDS.GetUnencryptedMessages('${account1.subdomain}').then(console.log);
`)
    setResults(`
window.FDS.GetUnencryptedMessages('${account2.subdomain}').then(console.log);
`)
    //todo check from sent mailbox too
  })

}

let createAndStore = (setOutput, setResults)=>{

  let r1 = Math.floor(Math.random() * 1010101);
  let r2 = Math.floor(Math.random() * 1010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', setOutput).then((account) => {
    account1 = account;
    setOutput(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      let r = Math.floor(Math.random() * 1010101);
      let file = new File(['hello storage world'], `test${r}.txt`, {type: 'text/plain'});
      acc1.store(file, console.log, console.log, console.log).then((stored)=>{
        console.log(`>>>> successfully stored ${stored} for ${acc1.subdomain}`);
      });
    })
  }).then(()=>{
    setResults(`
    createAndStore went well, try....

window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
  acc2.stored().then((stored)=>{
    console.log('m', stored.length)
    stored[0].getFile().then(console.log)
    stored[0].saveAs();
  })
})`)
  });

}

let createAndBackup = (setOutput, setResults)=>{
  let r1 = Math.floor(Math.random() * 1010101);
  let r2 = Math.floor(Math.random() * 1010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', setOutput).then((account) => {
    account1 = account;
    setResults(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.BackupAccount(account1.subdomain, 'test');
  }).then(()=>{
    setResults(`createAndBackup went well, backup should have been downloaded`)
  });

}

let backupJSON = null;

let createDeleteAndRestore = (setOutput, setResults)=>{
  let r1 = Math.floor(Math.random() * 1010101);
  let r2 = Math.floor(Math.random() * 1010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', setOutput).then((account) => {
    account1 = account;
    setOutput(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    let accounts = window.FDS.GetAccounts();
    let f = accounts.filter((a)=>{return a.subdomain === account1.subdomain});
    if(f.length === 1){
      setOutput(`success: account ${account1.subdomain} exists`);
      backupJSON = JSON.stringify(accounts[0].wallet);
    }else{
      throw new Error(`account ${account1.subdomain} does not exist`)
    }
    return window.FDS.DeleteAccount(account1.subdomain);
  }).then(()=>{
    let accounts = window.FDS.GetAccounts();
    let f = accounts.filter((a)=>{return a.subdomain === account1.subdomain});
    if(f.length === 0){
      setOutput(`success: account ${account1.subdomain} does not exist`)
    }else{
      throw new Error(`account ${account1.subdomain} exists`)
    }
  }).then(()=>{
    let backupFile = new File([backupJSON], `fairdrop-wallet-${account1.subdomain}-backup (1).json`, {type: 'text/plain'});
    window.FDS.RestoreAccount(backupFile).then(()=>{
      let accounts = window.FDS.GetAccounts();
      let f = accounts.filter((a)=>{return a.subdomain === account1.subdomain});
      if(f.length === 1){
        setOutput(`success: account ${account1.subdomain} exists`)
      }else{
        throw new Error(`account ${account1.subdomain} does not exist`)
      }    
    }).then(()=>{
      setResults(`
        createDeleteAndRestore went well, file should have downloaded
      `);
    });
    //todo check you can send to/from and store
  }).catch(console.error);

}



let createAndStoreValue = (setOutput, setResults) => {
  let r1 = Math.floor(Math.random() * 1010101);
  let r2 = Math.floor(Math.random() * 1010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    setOutput(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      acc1.storeValue('k1', 'hello value world').then((stored)=>{
        setOutput(`>>>> successfully stored ${stored} for ${acc1.subdomain}`);
      });
    })
  }).then(()=>{
    setResults(`
createAndStoreValue went well, try...
window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
  acc2.retrieveValue('k1').then(console.log)
})`)
  });
}

let createAndStoreEncryptedValue = (setOutput, setResults)=>{
  let r1 = Math.floor(Math.random() * 1010101);
  let r2 = Math.floor(Math.random() * 1010101);
  let account1, account2 = null;
  window.FDS.CreateAccount(`test${r1}`, 'test', console.log).then((account) => {
    account1 = account;
    setOutput(`registered account 1 ${account1.subdomain}`);  
  }).then(()=>{
    return window.FDS.UnlockAccount(account1.subdomain, 'test').then((acc1)=>{
      acc1.storeEncryptedValue('k1', 'hello encrypted value world').then((stored)=>{
        setOutput(`>>>> successfully stored ${stored} for ${acc1.subdomain}`);
      });
    })
  }).then(()=>{
    setResults(`window.FDS.UnlockAccount('${account1.subdomain}', 'test').then((acc2)=>{
  acc2.retrieveDecryptedValue('k1').then(console.log)
})`)
  });
}

// simulateCreateTwoAndSendTwo(callback);
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


let r1 = Math.floor(Math.random() * 1010101);

// window.FDS.CreateAccount(`test${r1}`, 'test', console.log)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      output: "",
      results: ""
    }



    simulateCreateTwoAndSendEncrypted(
      (output)=>{
        this.setOutput(output, this);
      },
      (results)=>{
        this.setResults(results, this);
      }
    );

    // simulateCreateTwoSubdomainsAndSendUnencrypted(
    //   (output)=>{
    //     this.setOutput(output, this);
    //   },
    //   (results)=>{
    //     this.setResults(results, this);
    //   }
    // );    

    // createAndStore(
    //   (output)=>{
    //     this.setOutput(output, this);
    //   },
    //   (results)=>{
    //     this.setResults(results, this);
    //   }
    // );
    // createAndStoreValue(
    //   (output)=>{
    //     this.setOutput(output, this);
    //   },
    //   (results)=>{
    //     this.setResults(results, this);
    //   }
    // );
    // createAndStoreEncryptedValue(
    //   (output)=>{
    //     this.setOutput(output, this);
    //   },
    //   (results)=>{
    //     this.setResults(results, this);
    //   }
    // );
    // createAndBackup(
    //   (output)=>{
    //     this.setOutput(output, this);
    //   },
    //   (results)=>{
    //     this.setResults(results, this);
    //   }
    // );
    // createDeleteAndRestore(
    //   (output)=>{
    //     this.setOutput(output, this);
    //   },
    //   (results)=>{
    //     this.setResults(results, this);
    //   }
    // );




  }

  setOutput(output, context){
    context.setState({
      output: this.state.output + '\n' + output
    });
  }

  setResults(results, context){
    context.setState({
      completed: this.state.completed + 1,
      results: this.state.results + '\n' + results
    });
  }  

  render() {
    return (
      <div className="App">
        <pre>{this.state.completed}</pre>
        <pre>{this.state.results}</pre>
        <pre>{this.state.output}</pre>
      </div>
    );
  }
}

export default App;
