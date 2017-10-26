/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * This action increase 1 of the Counters by names in a MySQL Database
 *
 * @param   params.MYSQL_HOSTNAME    MySQL hostname
 * @param   params.MYSQL_USERNAME    MySQL username
 * @param   params.MYSQL_PASSWORD    MySQL password
 * @param   params.MYSQL_DATABASE    MySQL database
 * @param   params.names             Names of the counters to increase 1 into the table

 * @return  Promise for the MySQL result
 */
function myAction(params) {

  return new Promise(function(resolve, reject) {
    console.log('Connecting to MySQL database');
    var mysql = require('promise-mysql');
    var connection;
    mysql.createConnection({
      host: params.MYSQL_HOSTNAME,
      user: params.MYSQL_USERNAME,
      password: params.MYSQL_PASSWORD,
      database: params.MYSQL_DATABASE
    }).then(function(conn) {
      connection = conn;
      console.log('Creating table if it does not exist');
      return connection.query('CREATE TABLE IF NOT EXISTS `counters2` (`name` VARCHAR(128) PRIMARY KEY, `count` INT NOT NULL)');
    }).then(function() {
      console.log('Increasing the counters');
      //var queryText = 'SELECT * FROM counters2 WHERE name=?';
      //var insertText = 'INSERT INTO counters2 (name, count) VALUES(?, 1)';
      var queryText = 'UPDATE counters2 SET count=count+1 WHERE name in ';
      var names = '('+params.names+')';
      console.log(params.names);
      console.log(names);
      queryText = queryText + names;
      console.log(queryText);
      var result = connection.query(queryText);
      connection.end();
      return result;
    }).then(function(result) {
      resolve({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          success: "Counters increased 1.",
          value: result
        }
      });
    }).catch(function(error) {
      if (connection && connection.end) connection.end();
      console.log(error);
      reject({
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 500,
        body: {
          error: "Error."
        }
      });
    });
  });

}

exports.main = myAction;
