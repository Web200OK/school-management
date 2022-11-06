const express = require('express')
const router = express.Router()

const mysql = require('../mysql')

router.post('/api', (req, res) => {
  mysql.query(req.body.sql, function (err, result) {
    res.json({
      res: result
    })
  })
})

module.exports = router
