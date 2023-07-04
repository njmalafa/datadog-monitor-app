const express = require('express');
const app = express();
const ldap = require('ldapjs');
const axios = require('axios');

app.use(express.json());


    // Define LDAP client options

    const ldapClient = ldap.createClient({
      url: 'ldap://0.0.0.0:389'
    });


app.get('/users/:username/:password', (req, res) => {

const username = req.params.username;
const password = req.params.password;

    console.log(username,"user", password,"password")
    

    const ldapOptions = {
        filter: `(&(uid=${username})(objectclass=inetOrgPerson))`,
        scope: 'sub',
        attributes: ['dn', 'cn'],
      };
      
    ldapClient.bind(`uid=${username},ou=users,dc=sirius,dc=com`, password, (err) => {
    if (err) {
      res.status(500).json({ error: 'LDAP bind error' });
      return;
    }


    ldapClient.search('ou=users,dc=sirius,dc=com', ldapOptions, (searchErr, searchRes) => {
      console.log(searchRes,"result")
      if (searchErr) {
        res.status(500).json({ error: 'LDAP search error' });
        return;
      }

      searchRes.on('searchEntry', (entry) => {
        console.log(entry.object,"entry")
        // User found in LDAP
        const user = entry.object;

        console.log(user,"User Details");

        // Check role bindings using Confluent Platform API or CLI
        // exec('confluent command', (cpErr, cpStdout, cpStderr) => {
        //   if (cpErr) {
        //     res.status(500).json({ error: 'Confluent Platform error' });
        //     return;
        //   }

        //  console.log(cpStdout,cpStderr,"response")
        
        // });
      });

      searchRes.on('error', (error) => {
        res.status(500).json({ error: 'LDAP search error' });
      });
    });
  });
});



    
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

