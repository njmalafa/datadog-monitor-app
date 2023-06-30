const express = require('express');
const app = express();
const ldap = require('ldapjs');
const axios = require('axios');

app.use(express.json());


    // Define LDAP client options
const ldapClient = ldap.createClient({
    url: 'ldap://0.0.0.0:389'
    // url: process.env.LDAP_URL, // Set your LDAP server URL in the .env file
  });

   // LDAP authentication route
app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    console.log(username,"user", password,"password")
    
    const ldapOptions = {
        filter: `(&(uid=${username})(objectclass=inetOrgPerson))`,
        scope: 'sub',
        attributes: ['dn', 'cn'],
      };
      
    ldapClient.bind(`uid=${username},ou=users,dc=sirius,dc=com`, password, (err) => {
      if (err) {
        res.status(401).json({ message: 'Authentication failed' });
      } else {
        ldapClient.search('ou=users,dc=sirius,dc=com', ldapOptions, (err, result) => {
          if (err) {
            res.status(500).json({ message: 'Error searching LDAP' });
          } else {
            result.on('searchEntry', (entry) => {
              // Successful authentication
              res.status(200).json({ message: 'Authentication successful' });
            });
  
            result.on('error', (err) => {
              res.status(500).json({ message: 'Error searching LDAP' });
            });
  
            result.on('end', (result) => {
              // No entry found
              res.status(401).json({ message: 'Authentication failed' });
            });
          }
        });
      }
    });
  });  

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
})