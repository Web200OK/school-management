const express = require('express')
const router = express.Router()

const mysql = require('../mysql')

router.post('/create-student', (req, res) => {
  let sql = `INSERT INTO student ( id, password,name,sex,tel,class,time )
                       VALUES
                       ('${req.body.id}', '123456', '${req.body.name}', '${req.body.sex}', '${req.body.tel}', '${req.body.class}', NOW());
INSERT INTO achievement (stucode, name, sxfx, gdds, jxjh, cyy, dxwl, cwf, time)
VALUES
    ('${req.body.id}', '${req.body.name}', '', '', '', '', '', '', NOW());
                       `
  mysql.query(sql, function (err, result) {
    res.json({
      res: typeof result == 'object',
      id: req.body.id,
      sql: sql
    })
  })
})
module.exports = router
