const debug = require('debug')('node-js-web-sandbox:routes:crypto');
const express = require('express');
const router = express.Router();

const crypto = require('crypto');


// Refer: https://qiita.com/kou_pg_0131/items/174aefd8f894fea4d11a
const create32byte = (input) => {
  return crypto.createHash('md5').update(input).digest('hex');
};

router.post('/encrypt', (req, res) => {
  //debug('encrypt:req.body', req.body);

  // Refer: https://qiita.com/Ishidall/items/bb0e0db86a2f56fb1022
  const ENCRYPTION_KEY = create32byte(req.body.email); // 32Byte.
  const BUFFER_KEY = 'RfHBdAR5RJHqp5wm'; // 16Byte.
  const ENCRYPT_METHOD = 'aes-256-cbc';
  const ENCODING = 'hex';

  const getEncryptedString = (raw) => {
    const iv = Buffer.from(BUFFER_KEY);
    const cipher = crypto.createCipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(raw);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString(ENCODING);
  };


  const local = {
    title: 'Encrypt POST | Crypto',
    data: {
      result: getEncryptedString(req.body.text)
    }
  };

  res.render('crypto/encrypt', local);
});


router.post('/decrypt', (req, res) => {
  debug('decrypt:req.body', req.body);

  // Refer: https://qiita.com/Ishidall/items/bb0e0db86a2f56fb1022
  const ENCRYPTION_KEY = create32byte(req.body.email); // 32Byte.
  const BUFFER_KEY = 'RfHBdAR5RJHqp5wm'; // 16Byte.
  const ENCRYPT_METHOD = 'aes-256-cbc';
  const ENCODING = 'hex';

  const getDecryptedString = (encrypted) => {
    let iv = Buffer.from(BUFFER_KEY);
    let encryptedText = Buffer.from(encrypted, ENCODING);
    let decipher = crypto.createDecipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString()
  };

  const local = {
    title: 'Decrypt POST | Crypto',
    data: {
      result: getDecryptedString(req.body.text)
    }
  };

  res.render('crypto/decrypt', local);
});


router.get('/:view', function(req, res, next) {
  const local = {
    title: req.params.view + ' | Crypto',
    data: {}
  };

  res.render('crypto/' + req.params.view, local);
});



module.exports = router;

